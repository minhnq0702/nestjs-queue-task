import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService extends Logger {
  private readonly logger: winston.Logger;

  constructor(context: string) {
    super(context);
    this.context = context;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, stack, context }) => {
          return `${timestamp} - [${level.toUpperCase()}]${context ? '[' + context + ']' : ''} ${message} ${stack ? '\n' + stack : ''}`;
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat()
        // winston.format.padLevels()
        // winston.format.simple()
      ),
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.colorize({
              all: true,
              colors: { info: 'blue', error: 'red', debug: 'yellow' }
            })
          )
        })

        // new winston.transports.DailyRotateFile({
        //   dirname: `logs/access`,
        //   filename: '%DATE%.log',
        //   datePattern: 'YYYY-MM-DD',
        //   level: 'debug',
        //   zippedArchive: true,
        // }),
        // new winston.transports.DailyRotateFile({
        //   dirname: `logs/error`,
        //   filename: '%DATE%-error.log',
        //   datePattern: 'YYYY-MM-DD',
        //   level: 'error',
        //   zippedArchive: true,
        // }),

        // new winston.transports.DailyRotateFile({
        //   dirname: `logs/${context}/info`,
        //   filename: '%DATE%.log',
        //   datePattern: 'YYYY-MM-DD',
        //   level: 'info',
        //   zippedArchive: true,
        // }),
        // new winston.transports.DailyRotateFile({
        //   dirname: `logs/${context}/info`,
        //   filename: '%DATE%.log',
        //   datePattern: 'YYYY-MM-DD',
        //   level: 'debug',
        //   zippedArchive: true,
        // }),
        // new winston.transports.DailyRotateFile({
        //   dirname: `logs/${context}/error`,
        //   filename: '%DATE%-error.log',
        //   datePattern: 'YYYY-MM-DD',
        //   level: 'error',
        //   zippedArchive: true,
        // }),
      ]
    });
    this.log(`Init logger instance`, context);
  }

  log(message: string | object, context?: string) {
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }
    this.logger.info(message, { context: context ?? this.context });
  }

  error(message: string, stack: string, context?: string) {
    this.logger.error(message, { stack, context: context ?? this.context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context: context ?? this.context });
  }
}
