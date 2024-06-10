import { ClientKafka } from '@nestjs/microservices';
import { KafkaController } from './kafka.controller';

describe('KafkaController', () => {
  let controller: KafkaController;

  beforeEach(async () => {
    controller = new KafkaController(new ClientKafka({}));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
