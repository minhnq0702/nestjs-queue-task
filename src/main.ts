import { config } from 'dotenv';
config({ path: ['.env.local', '.env'] });

import AllExceptionFilter from '@/common/http.exception.filter';
import { LoggingInterceptor } from '@/common/http.interceptor';
import { kafkaClientOptions } from '@/kafka/utils';
import { LoggerService } from '@/logger/logger.service';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { APP_PORT } from './constants';

/** Asynchronous Start microservices */
async function startMicroservice(app: INestApplication, _logger: LoggerService) {
  const AppConfig = app.get(ConfigService);

  _logger.debug('Starting connect microservice...', 'BOOTSTRAP');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafkaClientOptions(AppConfig),
  });
  await app.startAllMicroservices();
  _logger.debug('Start microservices completed!!!', 'BOOTSTRAP');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const _logger: LoggerService = app.get(Logger);

  // * define globle filter for exception
  const adapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(adapter, app.get(LoggerService)));

  // * define global interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(_logger, app.get(Reflector)));

  // * define global prefix
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [
      '*', // TODO remove *
      'http://localhost:8080',
    ],
    credentials: true,
  });

  const AppConfig = app.get(ConfigService);
  startMicroservice(app, _logger);

  await app.listen(AppConfig.get<string>(APP_PORT) || 3000);
  _logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
