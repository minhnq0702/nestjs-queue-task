import { MyException } from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    this.logger.error(`${JSON.stringify(exception)}`, exception.stack, 'ExceptionFilter');

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let code: number = 1;
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: string | object = 'INTERNAL_SERVER_ERROR';
    let message: string[] | null;
    let additional: object | null = null;
    switch (true) {
      case exception instanceof MyException:
        code = exception.code;
        statusCode = exception.httpStatus;
        error = exception.error;
        message = (exception.message && [exception.message]) || [];
        additional = exception.additional;
        break;
      case exception instanceof HttpException:
        code = statusCode = exception.getStatus();
        message = [exception.message];
        const httpError = exception.getResponse();
        if (typeof httpError === 'object') {
          error = httpError['error'];
          message = [httpError['message'] || message].flat();
        }
        break;
      case exception instanceof Error:
        message = [exception.message];
        break;
      default:
        break;
    }

    const responseBody = {
      code,
      error,
      message,
      timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest())
    };
    if (additional !== null) {
      responseBody['additional'] = additional;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
