import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { KafkaCronService } from './kafka.cron';
import { KafkaService } from './kafka.service';

@Module({
  imports: [ConfigModule, LoggerModule.register('Kafka')],
  providers: [KafkaCronService, KafkaService, ConfigService]
})
export class KafkaModule {
  constructor(private readonly logger: LoggerService) {
    this.logger.log('KafkaModule');
  }
}
