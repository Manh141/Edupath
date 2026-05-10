import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SPOOFABLE_AUTH_HEADERS } from '../constants/internal-headers.constant';

@Injectable()
export class ProxyAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    for (const header of SPOOFABLE_AUTH_HEADERS) {
      delete req.headers[header];
    }

    next();
  }
}
