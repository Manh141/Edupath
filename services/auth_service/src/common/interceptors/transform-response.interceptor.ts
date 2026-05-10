import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type SuccessResponse<T> = {
  success: true;
  data: T;
};

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T> | T
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T> | T> {
    return next.handle().pipe(
      map((data: T) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in (data as Record<string, unknown>)
        ) {
          return data;
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}
