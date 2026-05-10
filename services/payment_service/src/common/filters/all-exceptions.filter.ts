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
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const data = payload as Record<string, unknown>;
        message = (data.message as string | string[] | undefined) ?? message;
        if (typeof data.error === 'string') {
          code = data.error;
        }
        details = data;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      code = exception.code;
      details = exception.meta;
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          break;
        case 'P2021':
        case 'P2022':
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Database schema is out of date.';
          code = 'DATABASE_SCHEMA_OUTDATED';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = exception.message;
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database unavailable';
      code = 'DATABASE_UNAVAILABLE';
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
