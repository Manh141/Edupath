export type AuthRole = string;
export type AuthStatus = string;
export type AuthProvider = string;
export type SocialAuthProvider = "google" | "facebook";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  requestedRole?: AuthRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyAuthCodeRequest {
  challengeId: string;
  code: string;
}

export interface ResendAuthCodeRequest {
  challengeId: string;
}

export interface OAuthExchangeRequest {
  code: string;
}

export interface AuthUserSummary {
  id: string;
  email: string;
  role: AuthRole;
  roles: AuthRole[];
  status: AuthStatus;
  isEmailVerified: boolean;
  forcePasswordChange?: boolean;
}

export interface AuthChallengeResponse {
  message: string;
  challengeId: string;
  expiresInMinutes: number;
  email?: string;
  requestedRole?: AuthRole;
  /** OTP exposed only in development when EXPOSE_OTP_IN_RESPONSE=true */
  _devCode?: string;
}

export type RegisterResponse = AuthChallengeResponse;
export type LoginChallengeResponse = AuthChallengeResponse;

export interface AuthenticatedResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenType: "Bearer";
  expiresIn: number | string;
  user: AuthUserSummary;
}

export type LoginResponse = AuthenticatedResponse;
export type OAuthExchangeResponse = AuthenticatedResponse;

export interface RegisterVerificationResponse {
  message: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenType: "Bearer";
  expiresIn: number | string;
}

export interface LogoutResponse {
  message: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  normalizedEmail: string;
  provider: AuthProvider;
  status: AuthStatus;
  isEmailVerified: boolean;
  forcePasswordChange?: boolean;
  role: AuthRole;
  roles: AuthRole[];
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayMe {
  userId?: string;
  email?: string;
  role?: string;
  roles?: string[];
  sessionId?: string;
}

export interface GatewayRouteItem {
  name: string;
  target?: string;
  routePrefix: string;
}
