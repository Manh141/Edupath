export interface AuthContext {
  userId: string;
  email?: string;
  role?: string;
  roles: string[];
  sessionId?: string;
  issuer?: string;
  audience?: string | string[];
}
