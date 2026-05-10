import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  AuditAction,
  AuthChallenge,
  AuthChallengePurpose,
  AuthProvider,
  AuthStatus,
  Prisma,
} from '../../common/prisma/prisma-client';
import { AuditLogService } from '../../common/audit/audit-log.service';

import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import {
  AUTH_CHALLENGE_CODE_LENGTH,
  AUTH_MESSAGES,
  DEFAULT_INSTRUCTOR_ROLE,
  DEFAULT_STUDENT_ROLE,
} from '../../common/constants/auth.constants';
import { CACHE_KEYS } from '../../common/constants/cache.constants';
import {
  ROLES,
  expandRoleNames,
  resolveSessionPrimaryRole,
  resolveSessionRoleNames,
} from '../../common/constants/role.constants';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface';

import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { OAuthService } from './oauth.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { VerifyAuthCodeDto } from './dto/verify-auth-code.dto';
import { ResendAuthCodeDto } from './dto/resend-auth-code.dto';
import { GrantRolesDto } from './dto/grant-roles.dto';
import { ActivateInstructorRoleDto } from './dto/activate-instructor-role.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

type AuthAccountWithRelations = Prisma.AuthAccountGetPayload<{
  include: {
    role: true;
    accountRoles: {
      include: {
        role: true;
      };
    };
  };
}>;

type AccountStatusSnapshot = {
  status: AuthStatus;
  isEmailVerified?: boolean;
};

type SupportedOAuthProvider = 'google' | 'facebook';

type OAuthStatePayload = {
  provider: SupportedOAuthProvider;
  nextPath: string;
};

type SocialProfile = {
  providerUserId: string;
  email: string;
  fullName?: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfoResponse = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  error?: string;
  error_description?: string;
};

type FacebookTokenResponse = {
  access_token?: string;
  error?: {
    message?: string;
  };
};

type FacebookUserInfoResponse = {
  id?: string;
  email?: string;
  name?: string;
  error?: {
    message?: string;
  };
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly redisService: RedisService,
    private readonly oauthService: OAuthService,
    private readonly auditLogService: AuditLogService,
    @InjectQueue('mail_queue')
    private readonly mailQueue: Queue,
  ) {}

  // Pre-computed bcrypt hash used for constant-time comparison when account not found
  private static readonly DUMMY_HASH =
    '$2a$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async verifyPassword(
    candidate: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(candidate, hash);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private buildClientMeta(userAgent?: string, ipAddress?: string) {
    return {
      userAgent: userAgent?.slice(0, 500) ?? null,
      ipAddress: ipAddress?.slice(0, 100) ?? null,
    };
  }

  private getRefreshTokenExpiresAt(): Date {
    const days = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_IN_DAYS',
      7,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    return expiresAt;
  }

  private parseDurationToSeconds(value: string): number {
    const raw = value.trim().toLowerCase();
    const match = raw.match(/^(\d+)([smhd]?)$/);

    if (!match) {
      throw new Error(`Invalid duration format: ${value}`);
    }

    const amount = Number(match[1]);
    const unit = match[2] || 's';

    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 60 * 60;
      case 'd':
        return amount * 60 * 60 * 24;
      default:
        throw new Error(`Unsupported duration unit: ${unit}`);
    }
  }

  private getAccessTokenTtlSeconds(): number {
    const raw = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    return this.parseDurationToSeconds(raw);
  }

  private getAuthChallengeExpiresInMinutes(): number {
    return this.configService.get<number>(
      'AUTH_CHALLENGE_EXPIRES_IN_MINUTES',
      10,
    );
  }

  private getAuthChallengeMaxAttempts(): number {
    return this.configService.get<number>('AUTH_CHALLENGE_MAX_ATTEMPTS', 5);
  }

  private getAuthChallengeMaxResends(): number {
    return this.configService.get<number>('AUTH_CHALLENGE_MAX_RESENDS', 3);
  }

  private getOAuthStateTtlSeconds(): number {
    return (
      this.configService.get<number>('OAUTH_STATE_EXPIRES_IN_MINUTES', 10) * 60
    );
  }

  private getOAuthExchangeCodeTtlSeconds(): number {
    return (
      this.configService.get<number>(
        'OAUTH_EXCHANGE_CODE_EXPIRES_IN_MINUTES',
        5,
      ) * 60
    );
  }

  private sanitizeNextPath(nextPath?: string): string {
    const trimmed = nextPath?.trim();

    if (!trimmed || !trimmed.startsWith('/') || trimmed.startsWith('//')) {
      return '/dashboard';
    }

    return trimmed;
  }

  private getGoogleOAuthConfig() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')?.trim();
    const clientSecret = this.configService
      .get<string>('GOOGLE_CLIENT_SECRET')
      ?.trim();
    const callbackUrl = this.configService
      .get<string>('GOOGLE_CALLBACK_URL')
      ?.trim();

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new BadRequestException(
        'Google OAuth is not configured yet. Please provide Google client credentials and callback URL.',
      );
    }

    return {
      clientId,
      clientSecret,
      callbackUrl,
    };
  }

  private getFacebookOAuthConfig() {
    const clientId = this.configService
      .get<string>('FACEBOOK_CLIENT_ID')
      ?.trim();
    const clientSecret = this.configService
      .get<string>('FACEBOOK_CLIENT_SECRET')
      ?.trim();
    const callbackUrl = this.configService
      .get<string>('FACEBOOK_CALLBACK_URL')
      ?.trim();

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new BadRequestException(
        'Facebook OAuth is not configured yet. Please provide Facebook app credentials and callback URL.',
      );
    }

    return {
      clientId,
      clientSecret,
      callbackUrl,
    };
  }

  private getWebOAuthCallbackUrl(): URL {
    return new URL(
      `${this.configService.getOrThrow<string>('WEB_ORIGIN').replace(/\/$/, '')}/auth/callback`,
    );
  }

  private buildOAuthRedirect(params: {
    nextPath?: string;
    code?: string;
    error?: string;
  }): string {
    const url = this.getWebOAuthCallbackUrl();
    url.searchParams.set('next', this.sanitizeNextPath(params.nextPath));

    if (params.code) {
      url.searchParams.set('code', params.code);
    }

    if (params.error) {
      url.searchParams.set('error', params.error);
    }

    return url.toString();
  }

  buildOAuthErrorRedirect(
    nextPath: string | undefined,
    providerLabel: string,
    error: unknown,
  ): string {
    return this.buildOAuthRedirect({
      nextPath,
      error: this.normalizeOAuthErrorMessage(providerLabel, error),
    });
  }

  private normalizeOAuthErrorMessage(
    providerLabel: string,
    error: unknown,
  ): string {
    if (error instanceof BadRequestException) {
      const response = error.getResponse();
      if (
        response &&
        typeof response === 'object' &&
        'message' in response &&
        typeof response.message === 'string'
      ) {
        return response.message;
      }

      return error.message;
    }

    if (
      error instanceof ForbiddenException ||
      error instanceof UnauthorizedException
    ) {
      return error.message;
    }

    return `${providerLabel} login failed. Please try again.`;
  }

  private async createOAuthState(
    provider: SupportedOAuthProvider,
    nextPath?: string,
  ): Promise<string> {
    const state = this.tokenService.generateOpaqueToken();
    const payload: OAuthStatePayload = {
      provider,
      nextPath: this.sanitizeNextPath(nextPath),
    };

    await this.redisService.set(
      `${CACHE_KEYS.OAUTH_STATE}:${state}`,
      JSON.stringify(payload),
      this.getOAuthStateTtlSeconds(),
    );

    return state;
  }

  private async consumeOAuthState(
    provider: SupportedOAuthProvider,
    state?: string,
  ): Promise<OAuthStatePayload> {
    if (!state) {
      throw new BadRequestException('OAuth state is missing.');
    }

    const key = `${CACHE_KEYS.OAUTH_STATE}:${state}`;
    const rawPayload = await this.redisService.get(key);
    await this.redisService.del(key);

    if (!rawPayload) {
      throw new BadRequestException('OAuth state is invalid or has expired.');
    }

    let payload: OAuthStatePayload;

    try {
      payload = JSON.parse(rawPayload) as OAuthStatePayload;
    } catch {
      throw new BadRequestException('OAuth state payload is invalid.');
    }

    if (payload.provider !== provider) {
      throw new BadRequestException('OAuth state does not match the provider.');
    }

    return {
      provider: payload.provider,
      nextPath: this.sanitizeNextPath(payload.nextPath),
    };
  }

  private async storeOAuthExchangePayload(payload: unknown): Promise<string> {
    const code = this.tokenService.generateOpaqueToken();

    await this.redisService.set(
      `${CACHE_KEYS.OAUTH_EXCHANGE}:${code}`,
      JSON.stringify(payload),
      this.getOAuthExchangeCodeTtlSeconds(),
    );

    return code;
  }

  private async exchangeGoogleAuthorizationCode(
    code: string,
  ): Promise<GoogleTokenResponse> {
    const googleConfig = this.getGoogleOAuthConfig();
    const body = new URLSearchParams({
      code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.callbackUrl,
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const payload = (await response.json()) as GoogleTokenResponse;

    if (!response.ok || !payload.access_token) {
      throw new BadRequestException(
        payload.error_description ||
          'Google login is currently unavailable during token exchange.',
      );
    }

    return payload;
  }

  private async fetchGoogleProfile(
    accessToken: string,
  ): Promise<SocialProfile> {
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const payload = (await response.json()) as GoogleUserInfoResponse;

    if (!response.ok || !payload.sub || !payload.email) {
      throw new BadRequestException(
        payload.error_description ||
          payload.error ||
          'Google did not return the required profile information.',
      );
    }

    if (payload.email_verified === false) {
      throw new BadRequestException(
        'Please verify your Google account email before signing in.',
      );
    }

    return {
      providerUserId: payload.sub,
      email: payload.email,
      fullName: payload.name?.trim() || undefined,
    };
  }

  private async exchangeFacebookAuthorizationCode(
    code: string,
  ): Promise<FacebookTokenResponse> {
    const facebookConfig = this.getFacebookOAuthConfig();
    const tokenUrl = new URL(
      'https://graph.facebook.com/v23.0/oauth/access_token',
    );
    tokenUrl.searchParams.set('client_id', facebookConfig.clientId);
    tokenUrl.searchParams.set('client_secret', facebookConfig.clientSecret);
    tokenUrl.searchParams.set('redirect_uri', facebookConfig.callbackUrl);
    tokenUrl.searchParams.set('code', code);

    const response = await fetch(tokenUrl);
    const payload = (await response.json()) as FacebookTokenResponse;

    if (!response.ok || !payload.access_token) {
      throw new BadRequestException(
        payload.error?.message ||
          'Facebook login is currently unavailable during token exchange.',
      );
    }

    return payload;
  }

  private async fetchFacebookProfile(
    accessToken: string,
  ): Promise<SocialProfile> {
    const profileUrl = new URL('https://graph.facebook.com/me');
    profileUrl.searchParams.set('fields', 'id,name,email');
    profileUrl.searchParams.set('access_token', accessToken);

    const response = await fetch(profileUrl);
    const payload = (await response.json()) as FacebookUserInfoResponse;

    if (!response.ok || !payload.id) {
      throw new BadRequestException(
        payload.error?.message ||
          'Facebook did not return the required profile information.',
      );
    }

    if (!payload.email) {
      throw new BadRequestException(
        'Facebook did not return an email address. Please make sure your Facebook app requests the email permission and the account has a verified email.',
      );
    }

    return {
      providerUserId: payload.id,
      email: payload.email,
      fullName: payload.name?.trim() || undefined,
    };
  }

  private isOtpExposed(): boolean {
    return (
      this.configService.get<string>('NODE_ENV') !== 'production' &&
      this.configService.get<boolean>('EXPOSE_OTP_IN_RESPONSE') === true
    );
  }

  private generateNumericCode(length = AUTH_CHALLENGE_CODE_LENGTH): string {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  private hashChallengeCode(challengeId: string, code: string): string {
    return this.tokenService.hashToken(`${challengeId}:${code}`);
  }

  private async signAccessToken(payload: {
    userId: string;
    email: string;
    role: string;
    roles: string[];
    sessionId?: string;
  }): Promise<{ accessToken: string; jti: string }> {
    const jti = this.tokenService.generateOpaqueToken(16);
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );

    const issuer = this.configService.get<string>('JWT_ACCESS_ISSUER')?.trim();
    const audience = this.configService
      .get<string>('JWT_ACCESS_AUDIENCE')
      ?.trim();

    const accessToken = await this.jwtService.signAsync(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
        roles: payload.roles,
        jti,
        sid: payload.sessionId,
      },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: expiresIn as never,
        ...(issuer ? { issuer } : {}),
        ...(audience ? { audience } : {}),
      },
    );

    return {
      accessToken,
      jti,
    };
  }

  private async enqueueAuthCodeEmail(
    email: string,
    code: string,
    purpose: AuthChallengePurpose,
  ): Promise<void> {
    await this.mailQueue.add('send-auth-code-email', {
      email,
      code,
      purpose,
    });
  }

  private async getRoleByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  private async ensureRoleAssignments(params: {
    authAccountId: string;
    roleNames: string[];
    assignedByAuthAccountId?: string;
  }): Promise<string[]> {
    const uniqueRoleNames = Array.from(new Set(params.roleNames));

    if (uniqueRoleNames.length === 0) {
      return [];
    }

    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          in: uniqueRoleNames,
        },
      },
    });

    if (roles.length !== uniqueRoleNames.length) {
      throw new BadRequestException('One or more roles are invalid.');
    }

    await this.prisma.authAccountRole.createMany({
      data: roles.map((role) => ({
        authAccountId: params.authAccountId,
        roleId: role.id,
        assignedByAuthAccountId: params.assignedByAuthAccountId,
      })),
      skipDuplicates: true,
    });

    return roles.map((role) => role.name);
  }

  private async getRoleNamesForAccount(
    accountId: string,
    primaryRoleName?: string,
  ): Promise<string[]> {
    const memberships = await this.prisma.authAccountRole.findMany({
      where: {
        authAccountId: accountId,
      },
      include: {
        role: true,
      },
    });

    const roleNames = new Set(memberships.map((item) => item.role.name));

    if (primaryRoleName) {
      roleNames.add(primaryRoleName);
    }

    return expandRoleNames(roleNames);
  }

  private assertAccountIsEnabled(
    account: Pick<AccountStatusSnapshot, 'status'>,
  ) {
    if (account.status === AuthStatus.suspended) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    }

    if (account.status === AuthStatus.disabled) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_DISABLED);
    }
  }

  private assertAccountCanUseEmailAuth(account: AccountStatusSnapshot) {
    if (
      account.status === AuthStatus.pending_verification ||
      account.isEmailVerified === false
    ) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }

    this.assertAccountIsEnabled(account);
  }

  private async createAuthChallenge(params: {
    email: string;
    purpose: AuthChallengePurpose;
    fullName?: string;
    requestedRole?: string;
    authAccountId?: string;
    passwordHash?: string;
  }): Promise<{ challenge: AuthChallenge; code: string }> {
    const email = this.normalizeEmail(params.email);
    const code = this.generateNumericCode();

    const challenge = await this.prisma.authChallenge.create({
      data: {
        authAccountId: params.authAccountId,
        email,
        normalizedEmail: email,
        purpose: params.purpose,
        requestedRole: params.requestedRole,
        fullName: params.fullName,
        passwordHash: params.passwordHash,
        codeHash: 'pending',
        expiresAt: new Date(
          Date.now() + this.getAuthChallengeExpiresInMinutes() * 60 * 1000,
        ),
        lastSentAt: new Date(),
      },
    });

    const codeHash = this.hashChallengeCode(challenge.id, code);
    const updatedChallenge = await this.prisma.authChallenge.update({
      where: { id: challenge.id },
      data: {
        codeHash,
      },
    });

    return {
      challenge: updatedChallenge,
      code,
    };
  }

  private async verifyAuthChallenge(params: {
    challengeId: string;
    code: string;
    purpose: AuthChallengePurpose;
  }): Promise<AuthChallenge> {
    const challenge = await this.prisma.authChallenge.findUnique({
      where: {
        id: params.challengeId,
      },
    });

    if (!challenge || challenge.purpose !== params.purpose) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_AUTH_CHALLENGE);
    }

    if (challenge.consumedAt || challenge.expiresAt <= new Date()) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_AUTH_CHALLENGE);
    }

    if (challenge.attemptCount >= this.getAuthChallengeMaxAttempts()) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_AUTH_CHALLENGE);
    }

    const incomingHash = this.hashChallengeCode(challenge.id, params.code);

    if (incomingHash !== challenge.codeHash) {
      const updated = await this.prisma.authChallenge.update({
        where: { id: challenge.id },
        data: {
          attemptCount: {
            increment: 1,
          },
        },
      });

      if (updated.attemptCount >= this.getAuthChallengeMaxAttempts()) {
        await this.prisma.authChallenge.update({
          where: { id: challenge.id },
          data: {
            consumedAt: new Date(),
          },
        });
      }

      throw new BadRequestException(AUTH_MESSAGES.INVALID_AUTH_CODE);
    }

    return this.prisma.authChallenge.update({
      where: { id: challenge.id },
      data: {
        consumedAt: new Date(),
      },
    });
  }

  private async resendAuthChallenge(dto: ResendAuthCodeDto): Promise<{
    message: string;
    challengeId: string;
    expiresInMinutes: number;
    code?: string;
  }> {
    const challenge = await this.prisma.authChallenge.findUnique({
      where: {
        id: dto.challengeId,
      },
    });

    if (
      !challenge ||
      challenge.consumedAt ||
      challenge.expiresAt <= new Date()
    ) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_AUTH_CHALLENGE);
    }

    if (challenge.resendCount >= this.getAuthChallengeMaxResends()) {
      throw new BadRequestException(
        'You have reached the resend limit for this verification code.',
      );
    }

    const code = this.generateNumericCode();

    await this.prisma.authChallenge.update({
      where: { id: challenge.id },
      data: {
        resendCount: {
          increment: 1,
        },
        lastSentAt: new Date(),
        expiresAt: new Date(
          Date.now() + this.getAuthChallengeExpiresInMinutes() * 60 * 1000,
        ),
        codeHash: this.hashChallengeCode(challenge.id, code),
      },
    });

    await this.enqueueAuthCodeEmail(challenge.email, code, challenge.purpose);

    return {
      message: AUTH_MESSAGES.AUTH_CODE_RESENT,
      challengeId: challenge.id,
      expiresInMinutes: this.getAuthChallengeExpiresInMinutes(),
      ...(this.isOtpExposed() ? { _devCode: code } : {}),
    };
  }

  private async syncUserProfileFromAuthEvent(input: {
    id: string;
    email: string;
    fullName?: string | null;
  }): Promise<void> {
    const userServiceUrl = this.configService
      .get<string>('USER_SERVICE_URL')
      ?.trim();

    if (!userServiceUrl || !input.fullName) {
      return;
    }

    try {
      const internalServiceSecret =
        this.configService.get<string>('INTERNAL_SERVICE_SECRET')?.trim() ||
        undefined;

      const response = await fetch(
        `${userServiceUrl}/api/users/internal/create-from-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(internalServiceSecret
              ? {
                  'x-internal-service-secret': internalServiceSecret,
                  'x-internal-service-name': 'auth-service',
                }
              : {}),
          },
          body: JSON.stringify({
            id: input.id,
            email: input.email,
            fullName: input.fullName,
          }),
        },
      );

      if (response.ok || response.status === 409) {
        return;
      }

      const text = await response.text();
      this.logger.warn(
        `Failed to sync user profile from auth-service. status=${response.status} body=${text}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to sync user profile from auth-service: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  private async buildAuthenticatedResponse(params: {
    account: AuthAccountWithRelations;
    userAgent?: string;
    ipAddress?: string;
    successMessage: string;
  }) {
    await this.ensureRoleAssignments({
      authAccountId: params.account.id,
      roleNames: [params.account.role.name],
    });

    const rawRoleNames = await this.getRoleNamesForAccount(
      params.account.id,
      params.account.role.name,
    );
    const roleNames = resolveSessionRoleNames(rawRoleNames);
    const primaryRole = resolveSessionPrimaryRole(
      roleNames,
      params.account.role.name,
    );

    const refreshToken = this.tokenService.generateOpaqueToken();
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    const session = await this.sessionService.createSession({
      authAccountId: params.account.id,
      refreshToken,
      expiresAt: refreshTokenExpiresAt,
      ...this.buildClientMeta(params.userAgent, params.ipAddress),
    });

    const { accessToken } = await this.signAccessToken({
      userId: params.account.id,
      email: params.account.email,
      role: primaryRole,
      roles: roleNames,
      sessionId: session.id,
    });

    await this.prisma.authAccount.update({
      where: {
        id: params.account.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    await this.auditLogService.log({
      action: AuditAction.LOGIN_SUCCESS,
      actorId: params.account.id,
      actorEmail: params.account.email,
      metadata: { roles: roleNames, sessionId: session.id },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    return {
      message: params.successMessage,
      accessToken,
      refreshToken,
      accessTokenType: 'Bearer',
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      user: {
        id: params.account.id,
        email: params.account.email,
        role: primaryRole,
        roles: roleNames,
        status: params.account.status,
        isEmailVerified: params.account.isEmailVerified,
        forcePasswordChange: params.account.forcePasswordChange,
      },
    };
  }

  private async findAccountWithRelationsByEmail(normalizedEmail: string) {
    return this.prisma.authAccount.findUnique({
      where: {
        normalizedEmail,
      },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async blacklistAccessToken(jti: string): Promise<void> {
    const ttlSeconds = this.getAccessTokenTtlSeconds();

    await this.redisService.set(
      `${CACHE_KEYS.ACCESS_BLACKLIST}:${jti}`,
      '1',
      ttlSeconds,
    );
  }

  async registerWithEmail(dto: RegisterEmailDto) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    // All registrations start as student. Instructor is an activation-only
    // capability that requires an InstructorProfile, granted via
    // POST /api/auth/roles/instructor after onboarding.
    const requestedRole = ROLES.STUDENT;

    const existing =
      await this.findAccountWithRelationsByEmail(normalizedEmail);

    if (existing) {
      throw new BadRequestException(
        'Email already exists. Please log in instead.',
      );
    }

    const passwordHash = await this.hashPassword(dto.password);

    const { challenge, code } = await this.createAuthChallenge({
      email: normalizedEmail,
      fullName: dto.fullName,
      purpose: AuthChallengePurpose.register_email,
      requestedRole,
      passwordHash,
    });

    await this.enqueueAuthCodeEmail(challenge.email, code, challenge.purpose);

    return {
      message: AUTH_MESSAGES.AUTH_CODE_SENT,
      challengeId: challenge.id,
      expiresInMinutes: this.getAuthChallengeExpiresInMinutes(),
      email: challenge.email,
      requestedRole,
      ...(this.isOtpExposed() ? { _devCode: code } : {}),
    };
  }

  async verifyRegisterEmailCode(dto: VerifyAuthCodeDto) {
    const challenge = await this.verifyAuthChallenge({
      challengeId: dto.challengeId,
      code: dto.code,
      purpose: AuthChallengePurpose.register_email,
    });

    const existing = await this.findAccountWithRelationsByEmail(
      challenge.normalizedEmail,
    );

    if (existing) {
      throw new BadRequestException(
        'Email already exists. Please log in instead.',
      );
    }

    const studentRole = await this.getRoleByName(DEFAULT_STUDENT_ROLE);

    if (!studentRole) {
      throw new BadRequestException(
        'Default student role is missing. Please seed roles first.',
      );
    }

    const account = await this.prisma.authAccount.create({
      data: {
        email: challenge.email,
        normalizedEmail: challenge.normalizedEmail,
        passwordHash: challenge.passwordHash,
        roleId: studentRole.id,
        provider: AuthProvider.local,
        status: AuthStatus.active,
        isEmailVerified: true,
        accountRoles: {
          create: {
            roleId: studentRole.id,
          },
        },
      },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Instructor role is NEVER granted on register — users activate it after
    // completing InstructorProfile via POST /api/auth/roles/instructor.
    await this.syncUserProfileFromAuthEvent({
      id: account.id,
      email: account.email,
      fullName: challenge.fullName,
    });

    return { message: 'Registration complete. Please sign in.' };
  }

  async requestEmailLogin(dto: LoginEmailDto) {
    const normalizedEmail = this.normalizeEmail(dto.email);

    const account = await this.findAccountWithRelationsByEmail(normalizedEmail);

    // Always run bcrypt.compare to mitigate timing attacks, even when account missing.
    const rawHash: unknown = account?.passwordHash;
    const storedHash: string =
      typeof rawHash === 'string' && rawHash.length > 0
        ? rawHash
        : AuthService.DUMMY_HASH;
    const passwordMatches = await this.verifyPassword(dto.password, storedHash);

    if (!account || !account.passwordHash || !passwordMatches) {
      if (account && account.provider !== AuthProvider.local) {
        throw new UnauthorizedException(
          'This account uses social sign-in. Please continue with your social provider.',
        );
      }

      throw new UnauthorizedException('Invalid email or password.');
    }

    this.assertAccountCanUseEmailAuth(account);

    const { challenge, code } = await this.createAuthChallenge({
      email: account.email,
      purpose: AuthChallengePurpose.login_email,
      authAccountId: account.id,
    });

    await this.enqueueAuthCodeEmail(account.email, code, challenge.purpose);

    return {
      message: AUTH_MESSAGES.AUTH_CODE_SENT,
      challengeId: challenge.id,
      expiresInMinutes: this.getAuthChallengeExpiresInMinutes(),
      email: account.email,
      ...(this.isOtpExposed() ? { _devCode: code } : {}),
    };
  }

  async loginAdminWithPassword(
    dto: AdminLoginDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    const account = await this.findAccountWithRelationsByEmail(normalizedEmail);

    // Always run bcrypt.compare to mitigate timing attacks, even when account missing.
    const rawHash: unknown = account?.passwordHash;
    const storedHash: string =
      typeof rawHash === 'string' && rawHash.length > 0
        ? rawHash
        : AuthService.DUMMY_HASH;
    const passwordMatches = await this.verifyPassword(dto.password, storedHash);

    if (!account || !account.passwordHash || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (account.provider !== AuthProvider.local) {
      throw new UnauthorizedException(
        'This account uses social sign-in. Please continue with your social provider.',
      );
    }

    this.assertAccountCanUseEmailAuth(account);

    const roleNames = await this.getRoleNamesForAccount(
      account.id,
      account.role.name,
    );

    if (!roleNames.includes(ROLES.ADMIN)) {
      throw new ForbiddenException('Admin access is required.');
    }

    return this.buildAuthenticatedResponse({
      account,
      userAgent,
      ipAddress,
      successMessage: 'Admin sign-in successful.',
    });
  }

  async verifyLoginEmailCode(
    dto: VerifyAuthCodeDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const challenge = await this.verifyAuthChallenge({
      challengeId: dto.challengeId,
      code: dto.code,
      purpose: AuthChallengePurpose.login_email,
    });

    const account = challenge.authAccountId
      ? await this.prisma.authAccount.findUnique({
          where: { id: challenge.authAccountId },
          include: {
            role: true,
            accountRoles: {
              include: {
                role: true,
              },
            },
          },
        })
      : await this.findAccountWithRelationsByEmail(challenge.normalizedEmail);

    if (!account) {
      throw new UnauthorizedException(
        'The account for this verification challenge was not found.',
      );
    }

    this.assertAccountIsEnabled(account);

    return this.buildAuthenticatedResponse({
      account,
      userAgent,
      ipAddress,
      successMessage: 'Email sign-in successful.',
    });
  }

  async resendEmailAuthCode(dto: ResendAuthCodeDto) {
    return this.resendAuthChallenge(dto);
  }

  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const session =
      await this.sessionService.findActiveSessionByRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    this.assertAccountIsEnabled(session.authAccount);

    await this.ensureRoleAssignments({
      authAccountId: session.authAccount.id,
      roleNames: [session.authAccount.role.name],
    });
    const rawRoleNames = await this.getRoleNamesForAccount(
      session.authAccount.id,
      session.authAccount.role.name,
    );
    const roleNames = resolveSessionRoleNames(rawRoleNames);
    const primaryRole = resolveSessionPrimaryRole(
      roleNames,
      session.authAccount.role.name,
    );

    const newRefreshToken = this.tokenService.generateOpaqueToken();

    await this.sessionService.revokeSessionByRefreshToken(refreshToken);

    const newSession = await this.sessionService.createSession({
      authAccountId: session.authAccount.id,
      refreshToken: newRefreshToken,
      expiresAt: this.getRefreshTokenExpiresAt(),
      ...this.buildClientMeta(userAgent, ipAddress),
    });

    const { accessToken } = await this.signAccessToken({
      userId: session.authAccount.id,
      email: session.authAccount.email,
      role: primaryRole,
      roles: roleNames,
      sessionId: newSession.id,
    });

    return {
      message: 'Session refreshed successfully.',
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenType: 'Bearer',
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    };
  }

  async logout(refreshToken: string, currentUser?: CurrentUserData) {
    const session =
      await this.sessionService.findActiveSessionByRefreshToken(refreshToken);

    if (!session) {
      return {
        message: 'Signed out successfully.',
      };
    }

    if (currentUser && session.authAccountId !== currentUser.userId) {
      throw new ForbiddenException(
        'You are not allowed to revoke this session.',
      );
    }

    await this.sessionService.revokeSessionByRefreshToken(refreshToken);

    if (currentUser?.jti) {
      await this.blacklistAccessToken(currentUser.jti);
    }

    return {
      message: 'Signed out successfully.',
    };
  }

  async getMe(currentUser: CurrentUserData) {
    const account = await this.prisma.authAccount.findUnique({
      where: {
        id: currentUser.userId,
      },
      include: {
        role: true,
        accountRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!account) {
      throw new UnauthorizedException('Account not found.');
    }

    const rawRoles = await this.getRoleNamesForAccount(
      account.id,
      account.role.name,
    );
    const roles = resolveSessionRoleNames(rawRoles);
    const primaryRole = resolveSessionPrimaryRole(roles, account.role.name);

    return {
      id: account.id,
      email: account.email,
      normalizedEmail: account.normalizedEmail,
      provider: account.provider,
      status: account.status,
      isEmailVerified: account.isEmailVerified,
      forcePasswordChange: account.forcePasswordChange,
      role: primaryRole,
      roles,
      lastLoginAt: account.lastLoginAt,
      passwordChangedAt: account.passwordChangedAt,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async getGoogleAuthorizationUrl(nextPath?: string): Promise<string> {
    const googleConfig = this.getGoogleOAuthConfig();
    const state = await this.createOAuthState('google', nextPath);
    const authorizationUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );

    authorizationUrl.searchParams.set('client_id', googleConfig.clientId);
    authorizationUrl.searchParams.set('redirect_uri', googleConfig.callbackUrl);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid email profile');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('access_type', 'offline');
    authorizationUrl.searchParams.set('include_granted_scopes', 'true');
    authorizationUrl.searchParams.set('prompt', 'select_account');

    return authorizationUrl.toString();
  }

  async getFacebookAuthorizationUrl(nextPath?: string): Promise<string> {
    const facebookConfig = this.getFacebookOAuthConfig();
    const state = await this.createOAuthState('facebook', nextPath);
    const authorizationUrl = new URL(
      'https://www.facebook.com/v23.0/dialog/oauth',
    );

    authorizationUrl.searchParams.set('client_id', facebookConfig.clientId);
    authorizationUrl.searchParams.set(
      'redirect_uri',
      facebookConfig.callbackUrl,
    );
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'email,public_profile');
    authorizationUrl.searchParams.set('state', state);

    return authorizationUrl.toString();
  }

  private async handleOAuthCallback(params: {
    provider: SupportedOAuthProvider;
    providerEnum: typeof AuthProvider.google | typeof AuthProvider.facebook;
    providerLabel: string;
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<string> {
    let nextPath = '/dashboard';

    try {
      if (params.error) {
        throw new BadRequestException(
          params.errorDescription ||
            `${params.providerLabel} login was cancelled or denied.`,
        );
      }

      const statePayload = await this.consumeOAuthState(
        params.provider,
        params.state,
      );
      nextPath = statePayload.nextPath;

      if (!params.code) {
        throw new BadRequestException(
          `${params.providerLabel} did not return an authorization code.`,
        );
      }

      const socialProfile =
        params.provider === 'google'
          ? await this.fetchGoogleProfile(
              (await this.exchangeGoogleAuthorizationCode(params.code))
                .access_token as string,
            )
          : await this.fetchFacebookProfile(
              (await this.exchangeFacebookAuthorizationCode(params.code))
                .access_token as string,
            );

      const authenticatedResponse = await this.loginWithSocialProvider({
        provider: params.providerEnum,
        providerUserId: socialProfile.providerUserId,
        email: socialProfile.email,
        fullName: socialProfile.fullName,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
      });

      const exchangeCode = await this.storeOAuthExchangePayload(
        authenticatedResponse,
      );

      return this.buildOAuthRedirect({
        code: exchangeCode,
        nextPath,
      });
    } catch (error) {
      this.logger.warn(
        `${params.providerLabel} OAuth callback failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );

      return this.buildOAuthRedirect({
        nextPath,
        error: this.normalizeOAuthErrorMessage(params.providerLabel, error),
      });
    }
  }

  async handleGoogleOAuthCallback(params: {
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<string> {
    return this.handleOAuthCallback({
      provider: 'google',
      providerEnum: AuthProvider.google,
      providerLabel: 'Google',
      ...params,
    });
  }

  async handleFacebookOAuthCallback(params: {
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<string> {
    return this.handleOAuthCallback({
      provider: 'facebook',
      providerEnum: AuthProvider.facebook,
      providerLabel: 'Facebook',
      ...params,
    });
  }

  async exchangeOAuthCode(code: string) {
    const exchangeKey = `${CACHE_KEYS.OAUTH_EXCHANGE}:${code}`;
    const rawPayload = await this.redisService.get(exchangeKey);

    if (!rawPayload) {
      throw new UnauthorizedException(
        'OAuth sign-in code is invalid or has expired.',
      );
    }

    await this.redisService.del(exchangeKey);

    try {
      return JSON.parse(rawPayload) as Record<string, unknown>;
    } catch {
      throw new UnauthorizedException('OAuth exchange payload is invalid.');
    }
  }

  private async loginWithSocialProvider(params: {
    provider: typeof AuthProvider.google | typeof AuthProvider.facebook;
    providerUserId: string;
    email: string;
    fullName?: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const { account, isNewAccount } = await this.oauthService.loginWithProvider(
      {
        provider: params.provider,
        email: params.email,
        providerUserId: params.providerUserId,
      },
    );

    this.assertAccountIsEnabled(account);

    if (isNewAccount && params.fullName) {
      await this.syncUserProfileFromAuthEvent({
        id: account.id,
        email: account.email,
        fullName: params.fullName,
      });
    }

    return this.buildAuthenticatedResponse({
      account,
      userAgent: params.userAgent,
      ipAddress: params.ipAddress,
      successMessage:
        params.provider === AuthProvider.google
          ? 'Google sign-in successful.'
          : 'Facebook sign-in successful.',
    });
  }

  async activateInstructorRole(
    currentUser: CurrentUserData,
    dto: ActivateInstructorRoleDto,
  ) {
    await this.ensureRoleAssignments({
      authAccountId: currentUser.userId,
      roleNames: [DEFAULT_INSTRUCTOR_ROLE],
      assignedByAuthAccountId: currentUser.userId,
    });

    if (dto.fullName) {
      await this.syncUserProfileFromAuthEvent({
        id: currentUser.userId,
        email: currentUser.email,
        fullName: dto.fullName,
      });
    }

    const sessionRoles = resolveSessionRoleNames(
      await this.getRoleNamesForAccount(currentUser.userId, currentUser.role),
    );

    return {
      message: 'Instructor role activated successfully.',
      role: resolveSessionPrimaryRole(sessionRoles, currentUser.role),
      roles: sessionRoles,
    };
  }

  async grantRoles(dto: GrantRolesDto, currentUser: CurrentUserData) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    const account = await this.findAccountWithRelationsByEmail(normalizedEmail);

    if (!account) {
      throw new BadRequestException('Target account was not found.');
    }

    const assignedRoleNames = await this.ensureRoleAssignments({
      authAccountId: account.id,
      roleNames: dto.roles,
      assignedByAuthAccountId: currentUser.userId,
    });

    await this.auditLogService.log({
      action: AuditAction.ROLE_GRANTED,
      actorId: currentUser.userId,
      actorEmail: currentUser.email,
      targetId: account.id,
      targetEmail: account.email,
      metadata: { grantedRoles: assignedRoleNames },
    });

    const sessionRoles = resolveSessionRoleNames(
      await this.getRoleNamesForAccount(account.id, account.role.name),
    );

    return {
      message: 'Roles granted successfully.',
      accountId: account.id,
      email: account.email,
      role: resolveSessionPrimaryRole(sessionRoles, account.role.name),
      grantedRoles: assignedRoleNames,
      roles: sessionRoles,
    };
  }
}
