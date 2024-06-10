import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';
import { kafkaClientOptions } from './utils';

@Injectable()
export class KafkaService {
  private client: Kafka;
  private consumer_topic: Record<string, Consumer> = {};
  constructor(
    private readonly logger: LoggerService,
    private readonly appConfig: ConfigService
  ) {
    this.client = new Kafka(kafkaClientOptions(appConfig));
  }

  onModuleInit() {
    // TODO: implement later
    this.consumeMessages('dev-test', 'test-group');
  }

  onModuleDestroy() {
    this.logger.log('KafkaService destroyed');
  }

  async consumeMessages(topic: string, groupId: string) {
    let consumer: Consumer;
    if (this.consumer_topic[topic]) {
      consumer = this.consumer_topic[topic];
    } else {
      consumer = this.client.consumer({
        groupId: groupId
      });
      consumer.connect();
      consumer.subscribe({ topic: topic, fromBeginning: true });
    }

    this.logger.debug('KafkaService: consume() called.');
    // ? should await here?
    consumer.run({
      // partitionsConsumedConcurrently: 3,
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        this.logger.debug(`KafkaService: consume() message: ${message.value.toString()} at ${topic}/${partition}`);
        // ? need to re-check if we need to call heartbeat() here
        await heartbeat();
      }
    });
    this.logger.debug('KafkaService: consume() ended.');
  }
}
