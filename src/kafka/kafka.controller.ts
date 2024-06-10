import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  constructor(@Inject('KAFKA_ODOO_TASK') private readonly client: ClientKafka) {}

  @MessagePattern('dev-test')
  devTest(@Payload() messages: any): Record<string, string> {
    console.log('Received message:', messages);
    this.client.emit('dev-test.reply', JSON.stringify({ status: 'ok' }));
    return { status: 'ok' };
  }

  @MessagePattern('dev-test.reply')
  devTestReply(@Payload() messages: any): Record<string, string> {
    console.log('Reply message:', messages);
    return { status: 'ok' };
  }
}
