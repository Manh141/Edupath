import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '../prisma/prisma-client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code: string | undefined;
    let details: unknown;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      code = exception.code;
      details = exception.meta;

      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate resource';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database request failed';
      }
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database unavailable';
      code = 'DATABASE_UNAVAILABLE';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const data = payload as Record<string, unknown>;
        message = (data.message as string | string[] | undefined) ?? exception.message;
        if (typeof data.error === 'string') {
          code = data.error;
        }
        details = data;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unknown unhandled exception', JSON.stringify(exception));
    }

    response.status(status).json({
      success: false,
      message,
      code,
      details,
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
