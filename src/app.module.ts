import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule.register('RootApp'), KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
