import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { INTERNAL_HEADERS } from '../constants/internal-headers.constant';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req.header(INTERNAL_HEADERS.requestId) ?? randomUUID();
    req.headers[INTERNAL_HEADERS.requestId] = requestId;
    res.setHeader(INTERNAL_HEADERS.requestId, requestId);
    next();
  }
}
