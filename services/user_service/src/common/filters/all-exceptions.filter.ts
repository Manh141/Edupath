import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../prisma/prisma-client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code: string | undefined;
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        const payload = errorResponse as Record<string, unknown>;
        if (payload.message) {
          message = payload.message as string | string[];
        }
        if (typeof payload.error === 'string') {
          code = payload.error;
        }
        details = payload;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      code = exception.code;
      details = exception.meta;

      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate data violates unique constraint';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Requested resource was not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    });
  }
}
