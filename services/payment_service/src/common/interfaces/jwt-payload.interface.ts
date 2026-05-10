export interface JwtPayloadInterface {
  sub: string;
  email?: string;
  roles?: string[];
}
