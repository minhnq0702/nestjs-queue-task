import { kafkaClientOptions } from '@/kafka/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const _logger: LoggerService = app.get(LoggerService);

  // * define global prefix
  app.setGlobalPrefix('/api');

  const AppConfig = app.get(ConfigService);

  _logger.debug('Starting connect microservice...');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafkaClientOptions(AppConfig)
  });
  app.startAllMicroservices();
  _logger.debug('Complete connect microservice...');

  await app.listen(AppConfig.get<string>('PORT') || 3000);
  _logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
