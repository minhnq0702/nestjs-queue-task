import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { KafkaController } from './kafka.controller';
import { KafkaCronService } from './kafka.cron';
import { KafkaService } from './kafka.service';
import { kafkaClientOptions } from './utils';

@Module({
  imports: [ConfigModule, LoggerModule.register('Kafka')],
  providers: [
    KafkaCronService,
    KafkaService,
    ConfigService,
    {
      provide: 'KAFKA_ODOO_TASK',
      useFactory: (configService: ConfigService) => {
        console.debug('>>>>>> INIT KAFKA SERVER FACTORY <<<<<<');
        return new ClientKafka(kafkaClientOptions(configService));
      },
      inject: [ConfigService]
    }
  ],
  controllers: [KafkaController]
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly logger: LoggerService,
    @Inject('KAFKA_ODOO_TASK') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    // ! only used for message-response mode. This action will automatically create a new topic with `.reply` suffix
    // this.kafkaClient.subscribeToResponseOf('dev-test');
    // await this.kafkaClient.connect();
    console.debug('>>>>>> INIT KAFKA SERVER CONNECTED <<<<<<');
  }

  async onModuleDestroy() {
    console.debug('>>>>>> INIT KAFKA SERVER DISCONNECTED <<<<<<');
    this.kafkaClient.close();
  }
}
