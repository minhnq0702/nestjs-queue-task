import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  constructor(@Inject('KAFKA_ODOO_TASK') private readonly client: ClientKafka) {}

  @EventPattern('dev-test') // ! use eventpattern instead of messagepattern for no reply needed
  async devTest(@Payload() messages: any, @Ctx() ctx: KafkaContext): Promise<Record<string, string>> {
    console.log('Received message:', messages, ctx);
    const heartbeat = ctx.getHeartbeat();
    this.client.emit('dev_1', JSON.stringify({ status: 'ok' }));
    await heartbeat();
    return { status: 'ok' };
  }

  @EventPattern('dev_1') // ! use eventpattern instead of messagepattern for no reply needed
  devTestReply(@Payload() messages: any): Record<string, string> {
    console.log('Reply message:', messages);
    return { status: 'ok' };
  }
}
