import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ThrottleGuard } from '../../common/guards/throttle.guard';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface';
import { ROLES } from '../../common/constants/role.constants';
import { AuthService } from './auth.service';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { VerifyAuthCodeDto } from './dto/verify-auth-code.dto';
import { ResendAuthCodeDto } from './dto/resend-auth-code.dto';
import { GrantRolesDto } from './dto/grant-roles.dto';
import { ActivateInstructorRoleDto } from './dto/activate-instructor-role.dto';
import { OAuthExchangeDto } from './dto/oauth-exchange.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({
    summary: 'Start passwordless registration with full name and email',
  })
  @Post('register-email')
  registerEmail(@Body() dto: RegisterEmailDto) {
    return this.authService.registerWithEmail(dto);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({
    summary: 'Verify email registration OTP and create the account',
  })
  @Post('register-email/verify')
  verifyRegisterEmail(@Body() dto: VerifyAuthCodeDto) {
    return this.authService.verifyRegisterEmailCode(dto);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({
    summary: 'Start passwordless login by sending an OTP to email',
  })
  @Post('login-email')
  loginEmail(@Body() dto: LoginEmailDto) {
    return this.authService.requestEmailLogin(dto);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({
    summary: 'Admin login with email and password',
  })
  @Post('admin/login')
  adminLogin(
    @Body() dto: AdminLoginDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.authService.loginAdminWithPassword(dto, userAgent, ip);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({
    summary: 'Verify passwordless login OTP and create a session',
  })
  @Post('login-email/verify')
  verifyLoginEmail(
    @Body() dto: VerifyAuthCodeDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.authService.verifyLoginEmailCode(dto, userAgent, ip);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @ApiOperation({ summary: 'Resend a register/login OTP challenge' })
  @Post('challenges/resend')
  resendEmailCode(@Body() dto: ResendAuthCodeDto) {
    return this.authService.resendEmailAuthCode(dto);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @Post('refresh')
  refresh(
    @Body() dto: RefreshTokenDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.authService.refresh(dto.refreshToken, userAgent, ip);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  logout(@Body() dto: LogoutDto, @CurrentUser() currentUser: CurrentUserData) {
    return this.authService.logout(dto.refreshToken, currentUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Get('me')
  me(@CurrentUser() currentUser: CurrentUserData) {
    return this.authService.getMe(currentUser);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @Get('google/authorize')
  async googleAuthorize(
    @Query('next') next: string | undefined,
    @Res() response: Response,
  ) {
    try {
      const url = await this.authService.getGoogleAuthorizationUrl(next);
      return response.redirect(url);
    } catch (error) {
      return response.redirect(
        this.authService.buildOAuthErrorRedirect(next, 'Google', error),
      );
    }
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ip: string | undefined,
    @Res() response: Response,
  ) {
    const redirectUrl = await this.authService.handleGoogleOAuthCallback({
      code,
      state,
      error,
      errorDescription,
      userAgent,
      ipAddress: ip,
    });

    return response.redirect(redirectUrl);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @Get('facebook/authorize')
  async facebookAuthorize(
    @Query('next') next: string | undefined,
    @Res() response: Response,
  ) {
    try {
      const url = await this.authService.getFacebookAuthorizationUrl(next);
      return response.redirect(url);
    } catch (error) {
      return response.redirect(
        this.authService.buildOAuthErrorRedirect(next, 'Facebook', error),
      );
    }
  }

  @Public()
  @Get('facebook/callback')
  async facebookCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ip: string | undefined,
    @Res() response: Response,
  ) {
    const redirectUrl = await this.authService.handleFacebookOAuthCallback({
      code,
      state,
      error,
      errorDescription,
      userAgent,
      ipAddress: ip,
    });

    return response.redirect(redirectUrl);
  }

  @Public()
  @UseGuards(ThrottleGuard)
  @Post('oauth/exchange')
  exchangeOAuthCode(@Body() dto: OAuthExchangeDto) {
    return this.authService.exchangeOAuthCode(dto.code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post('roles/instructor')
  activateInstructorRole(
    @CurrentUser() currentUser: CurrentUserData,
    @Body() dto: ActivateInstructorRoleDto,
  ) {
    return this.authService.activateInstructorRole(currentUser, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Post('admin/grant-roles')
  grantRoles(
    @Body() dto: GrantRolesDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.authService.grantRoles(dto, currentUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return {
      message: 'Only admins can access this endpoint.',
    };
  }
}
