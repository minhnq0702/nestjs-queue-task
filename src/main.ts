import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const _logger: LoggerService = app.get(LoggerService);

  const AppConfig = app.get(ConfigService);

  await app.listen(AppConfig.get<string>('PORT') || 3000);
  _logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
