import type { Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { INTERNAL_HEADERS } from '../constants/internal-headers.constant';

export function createPinoConfig(isProduction: boolean, level: string): Params {
  return {
    pinoHttp: {
      level,
      genReqId(req, res) {
        const existing = (req.headers[INTERNAL_HEADERS.requestId] as string | undefined) ?? randomUUID();
        res.setHeader(INTERNAL_HEADERS.requestId, existing);
        return existing;
      },
      customProps(req) {
        return {
          requestId: req.headers[INTERNAL_HEADERS.requestId],
        };
      },
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:standard',
            },
          },
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie'],
        censor: '[REDACTED]',
      },
    },
  };
}
