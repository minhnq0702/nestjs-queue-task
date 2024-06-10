import { ConfigService } from '@nestjs/config';

type KafkaClientOptions = {
  clientId: string;
  brokers: string[];
};

export const kafkaClientOptions = (appConfigSvc: ConfigService): KafkaClientOptions => {
  const brokers = appConfigSvc.get('KAFKA_BROKERS').split(',');
  return {
    clientId: 'kafka-client',
    brokers
  };
};
