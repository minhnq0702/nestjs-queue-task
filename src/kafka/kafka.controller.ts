import { OdooTaskDto } from '@/dto/odoo-task.dto';
import { Controller, Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { KafkaFilter } from './kafka.filter';

@Controller('kafka')
export class KafkaController {
  constructor(@Inject('KAFKA_ODOO_TASK') private readonly client: ClientKafka) {}

  @EventPattern('dev-test') // ! use eventpattern instead of messagepattern for no reply needed
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(KafkaFilter)
  async devTest(@Payload() messages: OdooTaskDto, @Ctx() ctx: KafkaContext): Promise<Record<string, string>> {
    console.log('Received message:', messages);
    const heartbeat = ctx.getHeartbeat();
    await heartbeat();
    this.client.emit('dev_1', JSON.stringify({ status: 'ok' }));
    return { status: 'ok' };
  }

  @EventPattern('dev_1') // ! use eventpattern instead of messagepattern for no reply needed
  devTestReply(@Payload() messages: any): Record<string, string> {
    console.log('Reply message:', messages);
    return { status: 'ok' };
  }
}
