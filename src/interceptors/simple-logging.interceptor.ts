import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class SimpleLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SimpleLoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method } = context.switchToHttp().getRequest<Request>();
    const [simpleUuid] = uuidv4().split('-');
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `[${simpleUuid}] ${method} ${url} ${Date.now() - now}ms`,
          ),
        ),
      )
      .pipe(
        catchError((err) => {
          this.logger.warn(
            `[${simpleUuid}] ${method} ${url} ${Date.now()} ${err}`,
          );
          return throwError(err);
        }),
      );
  }
}
