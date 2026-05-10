import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { INTERNAL_HEADERS } from '../constants/internal-headers.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string | string[] } | undefined)?.message ??
          'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.originalUrl,
      message,
      timestamp: new Date().toISOString(),
      requestId: request.header(INTERNAL_HEADERS.requestId) ?? 'unknown',
    });
  }
}
