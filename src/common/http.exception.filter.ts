import { MyException } from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    this.logger.error(`[AllExceptionFilter] exception ${JSON.stringify(exception)}`, exception.stack);

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
        message = [exception.message];
        additional = exception.additional;
        break;
      case exception instanceof HttpException:
        console.log('HttpException', exception);
        code = statusCode = exception.getStatus();
        const httpError = exception.getResponse();
        if (typeof httpError === 'object' && httpError.hasOwnProperty('message')) {
          error = httpError['error'];
          message = httpError['message'];
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
