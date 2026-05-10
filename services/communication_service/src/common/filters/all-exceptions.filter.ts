import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../prisma/prisma-client';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpHost = host.switchToHttp();
    const response = httpHost.getResponse<Response | undefined>();
    const request = httpHost.getRequest<Request | undefined>();

    if (!response || !request || typeof (response as Response).status !== 'function') {
      return;
    }

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
          message = 'Unique constraint violation.';
          break;
        case 'P2021':
        case 'P2022':
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Database schema is out of date.';
          code = 'DATABASE_SCHEMA_OUTDATED';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Requested resource was not found.';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database request failed.';
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database is unavailable.';
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
