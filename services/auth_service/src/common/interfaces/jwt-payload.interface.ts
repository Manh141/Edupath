export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  roles?: string[];
  jti: string;
  sid?: string;
  iss?: string;
  aud?: string | string[];
}
