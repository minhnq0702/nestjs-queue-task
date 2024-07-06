import { LoggerService } from '@/logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { checkPaginatedResp, IS_PAGINATION } from './paginate/paginate';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  checkIsPagination(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PAGINATION, [context.getHandler(), context.getClass()]) === true
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.checkIsPagination(context) && checkPaginatedResp(data)) {
          return {
            status: 'successfully',
            data: data.data,
            count: data.count,
            total: data.total,
          };
        }
        if (!(data instanceof Array)) {
          data = [data];
        }
        return {
          status: 'successfully',
          data,
        };
      }),
    );
  }
}
