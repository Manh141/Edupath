export interface CurrentUserData {
  userId: string;
  email: string;
  role: string;
  roles: string[];
  jti?: string;
  sessionId?: string;
}
