import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { KafkaService } from './kafka.service';

@Module({
  imports: [LoggerModule.register('Kafka')],
  providers: [KafkaService],
})
export class KafkaModule {
  constructor(private readonly logger: LoggerService) {
    logger.log('KafkaModule');
  }
}
