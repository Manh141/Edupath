import type { AuthContext } from '../../common/interfaces/auth-context.interface';

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}

export {};
