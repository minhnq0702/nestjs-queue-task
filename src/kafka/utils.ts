import { ConfigService } from '@nestjs/config';
import { KafkaOptions } from '@nestjs/microservices';

export const kafkaClientOptions = (appConfigSvc: ConfigService): KafkaOptions['options'] => {
  const brokers = appConfigSvc.get('KAFKA_BROKERS').split(',');
  return {
    client: {
      clientId: 'kafka-client',
      brokers
    },
    consumer: {
      groupId: 'kafka-consumer'
    }
  };
};
