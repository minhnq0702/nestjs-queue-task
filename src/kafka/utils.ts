import { KAFKA_BROKERS, KAFKA_PASSWORD, KAFKA_SASL_MECHANISM, KAFKA_SSL, KAFKA_USERNAME } from '@/constants';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions } from '@nestjs/microservices';
import { SASLOptions } from '@nestjs/microservices/external/kafka.interface';

export const kafkaClientOptions = (config: ConfigService): KafkaOptions['options'] => {
  const brokers = config.get<string>(KAFKA_BROKERS).split(',');
  const enableSSL = config.get<string>(KAFKA_SSL).toLowerCase() === 'true' ? true : false;
  const saslMechanism = config.get<string>(KAFKA_SASL_MECHANISM) as SASLOptions['mechanism'];
  return {
    client: {
      clientId: 'kafka-client',
      brokers,
      ssl: enableSSL,
      sasl:
        (saslMechanism &&
          ({
            mechanism: saslMechanism,
            username: config.get(KAFKA_USERNAME),
            password: config.get(KAFKA_PASSWORD),
          } as SASLOptions)) ||
        null,
      connectionTimeout: 10000,
      authenticationTimeout: 10000,
    },
    consumer: {
      groupId: 'kafka-consumer',
    },
  };
};
