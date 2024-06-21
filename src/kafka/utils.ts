import { KAFKA_BROKERS } from '@/constants';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions } from '@nestjs/microservices';

export const kafkaClientOptions = (config: ConfigService): KafkaOptions['options'] => {
  const brokers = config.get(KAFKA_BROKERS).split(',');
  return {
    client: {
      clientId: 'kafka-client',
      brokers,
    },
    consumer: {
      groupId: 'kafka-consumer',
    },
  };
};
