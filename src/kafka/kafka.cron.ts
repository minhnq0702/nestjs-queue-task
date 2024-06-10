import { LoggerService } from '@/logger/logger.service';
import { Inject, forwardRef } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { KafkaService } from './kafka.service';

export class KafkaCronService {
  constructor(
    @Inject(forwardRef(() => LoggerService)) private readonly logger: LoggerService,
    @Inject(forwardRef(() => KafkaService)) private readonly kafkaService: KafkaService
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // async cronConsumer() {
  //   this.logger.debug('CRON DO SOMETHING');
  // }
}
