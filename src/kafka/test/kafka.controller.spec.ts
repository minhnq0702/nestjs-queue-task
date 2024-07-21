import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaController } from '../kafka.controller';

describe('KafkaController', () => {
  let controller: KafkaController;

  beforeEach(async () => {
    controller = new KafkaController(new ClientKafka({}), new EventEmitter2());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return object', async () => {
  //   const result = await controller.devTest({} as any, {} as any);
  //   expect(result).toEqual({ status: 'ok' });
  // });
});
