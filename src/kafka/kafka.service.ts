import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private client: Kafka;
  private consumer_topic: Record<string, Consumer> = {};
  constructor(
    private readonly logger: LoggerService,
    private readonly appConfig: ConfigService
  ) {}
}
