import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AUTH_CHALLENGE_CODE_LENGTH, AUTH_MESSAGES, DEFAULT_STUDENT_ROLE } from '../../common/constants/auth.constants';
import {
  AuthChallengePurpose,
  AuthProvider,
  AuthStatus,
} from '../../common/prisma/prisma-client';
import type { AuditLogService } from '../../common/audit/audit-log.service';
import type { PrismaService } from '../../common/prisma/prisma.service';
import type { RedisService } from '../../common/redis/redis.service';
import type { OAuthService } from './oauth.service';
import { AuthService } from './auth.service';
import type { SessionService } from './session.service';
import type { TokenService } from './token.service';

function createConfigService(overrides: Record<string, unknown> = {}) {
  const values: Record<string, unknown> = {
    NODE_ENV: 'test',
    EXPOSE_OTP_IN_RESPONSE: true,
    AUTH_CHALLENGE_EXPIRES_IN_MINUTES: 10,
    AUTH_CHALLENGE_MAX_ATTEMPTS: 5,
    AUTH_CHALLENGE_MAX_RESENDS: 3,
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_ACCESS_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
    ...overrides,
  };

  return {
    get: jest.fn((key: string, fallback?: unknown) =>
      key in values ? values[key] : fallback,
    ),
    getOrThrow: jest.fn((key: string) => {
      if (!(key in values)) {
        throw new Error(`Missing config key ${key}`);
      }

      return values[key];
    }),
  } as unknown as ConfigService;
}

function createPrismaMock() {
  return {
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    authAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    authAccountRole: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
    authChallenge: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
}

describe('AuthService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let configService: ConfigService;
  let jwtService: { signAsync: jest.Mock };
  let tokenService: { generateOpaqueToken: jest.Mock; hashToken: jest.Mock };
  let sessionService: {
    createSession: jest.Mock;
    findActiveSessionByRefreshToken: jest.Mock;
    revokeSessionByRefreshToken: jest.Mock;
  };
  let redisService: { set: jest.Mock };
  let auditLogService: { log: jest.Mock };
  let mailQueue: { add: jest.Mock };
  let service: AuthService;

  const oauthService = {} as OAuthService;

  const baseAccount = {
    id: 'account-1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    passwordHash: 'stored-password-hash',
    provider: AuthProvider.local,
    status: AuthStatus.active,
    isEmailVerified: true,
    forcePasswordChange: false,
    role: { id: 'role-student', name: 'student' },
    accountRoles: [{ role: { name: 'student' } }],
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    configService = createConfigService();
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-access-token'),
    };
    tokenService = {
      generateOpaqueToken: jest
        .fn()
        .mockReturnValueOnce('refresh-token')
        .mockReturnValue('token-jti'),
      hashToken: jest.fn((value: string) => `hash:${value}`),
    };
    sessionService = {
      createSession: jest.fn().mockResolvedValue({ id: 'session-1' }),
      findActiveSessionByRefreshToken: jest.fn(),
      revokeSessionByRefreshToken: jest.fn().mockResolvedValue(undefined),
    };
    redisService = {
      set: jest.fn(),
    };
    auditLogService = {
      log: jest.fn().mockResolvedValue(undefined),
    };
    mailQueue = {
      add: jest.fn().mockResolvedValue(undefined),
    };

    service = new AuthService(
      prisma as unknown as PrismaService,
      configService,
      jwtService as unknown as JwtService,
      tokenService as unknown as TokenService,
      sessionService as unknown as SessionService,
      redisService as unknown as RedisService,
      oauthService,
      auditLogService as unknown as AuditLogService,
      mailQueue as never,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('generates a 6-digit OTP code', () => {
    const code = (service as unknown as { generateNumericCode: () => string }).generateNumericCode();

    expect(code).toHaveLength(AUTH_CHALLENGE_CODE_LENGTH);
    expect(code).toMatch(/^\d{6}$/);
  });

  it('registers with email by hashing the password and creating a challenge', async () => {
    prisma.authAccount.findUnique.mockResolvedValue(null);
    prisma.authChallenge.create.mockResolvedValue({
      id: 'challenge-1',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.register_email,
    });
    prisma.authChallenge.update.mockResolvedValue({
      id: 'challenge-1',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.register_email,
    });
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = await service.registerWithEmail({
      email: ' USER@example.com ',
      fullName: 'Test User',
      password: 'PlainText#123',
    });

    const passwordHash = prisma.authChallenge.create.mock.calls[0][0].data.passwordHash as string;

    expect(result.email).toBe('user@example.com');
    expect(result.requestedRole).toBe('student');
    expect(result._devCode).toBe('100000');
    expect(result._devCode).toMatch(/^\d{6}$/);
    expect(passwordHash).not.toBe('PlainText#123');
    await expect(bcrypt.compare('PlainText#123', passwordHash)).resolves.toBe(true);
    expect(mailQueue.add).toHaveBeenCalledWith('send-auth-code-email', {
      email: 'user@example.com',
      code: '100000',
      purpose: AuthChallengePurpose.register_email,
    });
  });

  it('rejects registration when the email already exists', async () => {
    prisma.authAccount.findUnique.mockResolvedValue(baseAccount);

    await expect(
      service.registerWithEmail({
        email: 'user@example.com',
        fullName: 'Existing User',
        password: 'PlainText#123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('verifies register OTP and creates an active verified student account', async () => {
    const passwordHash = await bcrypt.hash('PlainText#123', 4);
    const challenge = {
      id: 'challenge-1',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      fullName: 'Test User',
      passwordHash,
      purpose: AuthChallengePurpose.register_email,
      codeHash: 'hash:challenge-1:123456',
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      attemptCount: 0,
    };
    prisma.authChallenge.findUnique.mockResolvedValue(challenge);
    prisma.authChallenge.update.mockResolvedValueOnce({
      ...challenge,
      consumedAt: new Date(),
    });
    prisma.authAccount.findUnique.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({
      id: 'role-student',
      name: DEFAULT_STUDENT_ROLE,
    });
    prisma.authAccount.create.mockResolvedValue({
      ...baseAccount,
      passwordHash,
    });

    const result = await service.verifyRegisterEmailCode({
      challengeId: 'challenge-1',
      code: '123456',
    });

    expect(result).toEqual({ message: 'Registration complete. Please sign in.' });
    expect(prisma.authAccount.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'user@example.com',
          passwordHash,
          provider: AuthProvider.local,
          status: AuthStatus.active,
          isEmailVerified: true,
        }),
      }),
    );
  });

  it('rejects OTP verification when the code is wrong', async () => {
    prisma.authChallenge.findUnique.mockResolvedValue({
      id: 'challenge-1',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.login_email,
      codeHash: 'hash:challenge-1:123456',
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      attemptCount: 0,
    });
    prisma.authChallenge.update.mockResolvedValue({
      attemptCount: 1,
    });

    await expect(
      service.verifyLoginEmailCode({
        challengeId: 'challenge-1',
        code: '000000',
      }),
    ).rejects.toThrow(AUTH_MESSAGES.INVALID_AUTH_CODE);

    expect(prisma.authChallenge.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'challenge-1' },
        data: { attemptCount: { increment: 1 } },
      }),
    );
  });

  it('rejects OTP verification when the challenge has expired', async () => {
    prisma.authChallenge.findUnique.mockResolvedValue({
      id: 'challenge-1',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.login_email,
      codeHash: 'hash:challenge-1:123456',
      consumedAt: null,
      expiresAt: new Date(Date.now() - 60_000),
      attemptCount: 0,
    });

    await expect(
      service.verifyLoginEmailCode({
        challengeId: 'challenge-1',
        code: '123456',
      }),
    ).rejects.toThrow(AUTH_MESSAGES.INVALID_AUTH_CHALLENGE);
  });

  it('requests email login when the password is correct', async () => {
    const passwordHash = await bcrypt.hash('PlainText#123', 4);
    prisma.authAccount.findUnique.mockResolvedValue({
      ...baseAccount,
      passwordHash,
    });
    prisma.authChallenge.create.mockResolvedValue({
      id: 'challenge-2',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.login_email,
    });
    prisma.authChallenge.update.mockResolvedValue({
      id: 'challenge-2',
      email: 'user@example.com',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.login_email,
    });
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = await service.requestEmailLogin({
      email: 'user@example.com',
      password: 'PlainText#123',
    });

    expect(result.challengeId).toBe('challenge-2');
    expect(result._devCode).toBe('100000');
    expect(mailQueue.add).toHaveBeenCalledWith('send-auth-code-email', {
      email: 'user@example.com',
      code: '100000',
      purpose: AuthChallengePurpose.login_email,
    });
  });

  it('rejects email login when the password is wrong', async () => {
    const passwordHash = await bcrypt.hash('DifferentPassword#123', 4);
    prisma.authAccount.findUnique.mockResolvedValue({
      ...baseAccount,
      passwordHash,
    });

    await expect(
      service.requestEmailLogin({
        email: 'user@example.com',
        password: 'PlainText#123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifies login OTP and returns an authenticated session payload', async () => {
    prisma.authChallenge.findUnique.mockResolvedValue({
      id: 'challenge-1',
      normalizedEmail: 'user@example.com',
      purpose: AuthChallengePurpose.login_email,
      codeHash: 'hash:challenge-1:123456',
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      attemptCount: 0,
      authAccountId: 'account-1',
    });
    prisma.authChallenge.update.mockResolvedValueOnce({
      id: 'challenge-1',
      consumedAt: new Date(),
    });
    prisma.authAccount.findUnique.mockResolvedValue(baseAccount);
    prisma.role.findMany.mockResolvedValue([{ id: 'role-student', name: 'student' }]);
    prisma.authAccountRole.createMany.mockResolvedValue({ count: 1 });
    prisma.authAccountRole.findMany.mockResolvedValue([{ role: { name: 'student' } }]);
    prisma.authAccount.update.mockResolvedValue({ id: 'account-1' });
    tokenService.generateOpaqueToken
      .mockReturnValueOnce('refresh-token')
      .mockReturnValueOnce('access-jti');

    const result = await service.verifyLoginEmailCode(
      {
        challengeId: 'challenge-1',
        code: '123456',
      },
      'jest-agent',
      '127.0.0.1',
    );

    expect(result.accessToken).toBe('signed-access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).toEqual(
      expect.objectContaining({
        id: 'account-1',
        email: 'user@example.com',
        role: 'student',
        roles: ['student'],
      }),
    );
    expect(sessionService.createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        authAccountId: 'account-1',
        refreshToken: 'refresh-token',
        userAgent: 'jest-agent',
        ipAddress: '127.0.0.1',
      }),
    );
    expect(auditLogService.log).toHaveBeenCalled();
  });

  it('refreshes a session by rotating the refresh token', async () => {
    sessionService.findActiveSessionByRefreshToken.mockResolvedValue({
      id: 'session-1',
      authAccountId: 'account-1',
      authAccount: {
        id: 'account-1',
        email: 'user@example.com',
        status: AuthStatus.active,
        role: { name: 'student' },
      },
    });
    prisma.role.findMany.mockResolvedValue([{ id: 'role-student', name: 'student' }]);
    prisma.authAccountRole.createMany.mockResolvedValue({ count: 1 });
    prisma.authAccountRole.findMany.mockResolvedValue([{ role: { name: 'student' } }]);
    sessionService.createSession.mockResolvedValue({ id: 'session-2' });
    tokenService.generateOpaqueToken.mockReset();
    tokenService.generateOpaqueToken
      .mockReturnValueOnce('rotated-refresh-token')
      .mockReturnValueOnce('rotated-jti');

    const result = await service.refresh('old-refresh-token', 'jest-agent', '127.0.0.1');

    expect(result).toEqual({
      message: 'Session refreshed successfully.',
      accessToken: 'signed-access-token',
      refreshToken: 'rotated-refresh-token',
      accessTokenType: 'Bearer',
      expiresIn: '15m',
    });
    expect(sessionService.revokeSessionByRefreshToken).toHaveBeenCalledWith('old-refresh-token');
    expect(sessionService.createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        authAccountId: 'account-1',
        refreshToken: 'rotated-refresh-token',
      }),
    );
  });
});
