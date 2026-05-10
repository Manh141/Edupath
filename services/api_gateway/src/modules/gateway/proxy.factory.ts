import type { Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { ClientRequest } from 'node:http';
import type { Socket } from 'node:net';
import { Logger } from '@nestjs/common';
import type { AuthContext } from '../../common/interfaces/auth-context.interface';
import { INTERNAL_HEADERS } from '../../common/constants/internal-headers.constant';

type ProxyRequest = Request & { authContext?: AuthContext };

function writeBodyToProxy(proxyReq: ClientRequest, req: Request): void {
  if (!req.body || typeof req.body !== 'object') {
    return;
  }

  const contentType = proxyReq.getHeader('Content-Type');

  if (typeof contentType === 'string' && contentType.includes('application/json')) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
    return;
  }

  if (
    typeof contentType === 'string' &&
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    const bodyData = new URLSearchParams(req.body as Record<string, string>).toString();
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
}

function isExpressResponse(res: Response | Socket): res is Response {
  return typeof (res as Response).status === 'function';
}

export function buildServiceProxy(params: {
  serviceName: string;
  target: string;
  proxyTimeoutMs: number;
  authHeaderForwarding: boolean;
}): RequestHandler {
  const { serviceName, target, proxyTimeoutMs, authHeaderForwarding } = params;
  const logger = new Logger(`Proxy:${serviceName}`);

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    ws: true,
    secure: false,
    proxyTimeout: proxyTimeoutMs,
    timeout: proxyTimeoutMs,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: Request) => {
        const proxyRequest = req as ProxyRequest;
        const requestId = proxyRequest.header(INTERNAL_HEADERS.requestId);
        if (requestId) {
          proxyReq.setHeader(INTERNAL_HEADERS.requestId, requestId);
        }

        proxyReq.setHeader(INTERNAL_HEADERS.gatewayService, 'api-gateway');

        if (authHeaderForwarding && proxyRequest.authContext) {
          const authContext = proxyRequest.authContext;
          proxyReq.setHeader(INTERNAL_HEADERS.authVerified, 'true');
          proxyReq.setHeader(INTERNAL_HEADERS.authUserId, authContext.userId);

          if (authContext.email) {
            proxyReq.setHeader(INTERNAL_HEADERS.authEmail, authContext.email);
          }

          if (authContext.role) {
            proxyReq.setHeader(INTERNAL_HEADERS.authRole, authContext.role);
          }

          if (authContext.roles.length > 0) {
            proxyReq.setHeader(INTERNAL_HEADERS.authRoles, authContext.roles.join(','));
          }

          if (authContext.sessionId) {
            proxyReq.setHeader(INTERNAL_HEADERS.authSessionId, authContext.sessionId);
          }
        }

        writeBodyToProxy(proxyReq, proxyRequest);
      },
      error: (error: Error, req: Request, res: Response | Socket) => {
        const requestId = req.header(INTERNAL_HEADERS.requestId) ?? 'unknown';
        logger.error({ requestId, target, error: error.message }, 'Proxy upstream error');

        if (isExpressResponse(res) && !res.headersSent) {
          res.status(502).json({
            success: false,
            message: `Cannot reach upstream service: ${serviceName}`,
            requestId,
            target,
          });
        }
      },
    },
  });
}
