import { LoggerModule } from '@/logger/logger.module';
import { LoggerService } from '@/logger/logger.service';
import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT_REF } from './constant';
import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';
import { kafkaClientOptions } from './utils';

@Module({
  imports: [LoggerModule.register('Kafka')],
  providers: [
    KafkaService,
    ConfigService,
    {
      provide: KAFKA_CLIENT_REF,
      useFactory: (logger: LoggerService, configService: ConfigService) => {
        logger.debug('>>>>>> INIT KAFKA SERVER FACTORY <<<<<<');
        return new ClientKafka(kafkaClientOptions(configService));
      },
      inject: [LoggerService, ConfigService]
    }
  ],
  controllers: [KafkaController]
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly logger: LoggerService,
    @Inject(KAFKA_CLIENT_REF) private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    // ! only used for message-response mode. This action will automatically create a new topic with `.reply` suffix
    // this.kafkaClient.subscribeToResponseOf('dev-test');
    // await this.kafkaClient.connect();
    this.logger.debug('>>>>>> INIT KAFKA SERVER CONNECTED <<<<<<');
  }

  async onModuleDestroy() {
    this.kafkaClient.close(); // ? need ?
    this.logger.debug('>>>>>> INIT KAFKA SERVER DISCONNECTED <<<<<<');
  }
}
