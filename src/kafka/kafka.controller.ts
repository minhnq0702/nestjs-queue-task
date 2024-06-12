import { EMIT_CREATE_TASK } from '@/constants';
import { TaskDto } from '@/dto/task.dto';
import { Task } from '@/entities/task.entity';
import { Controller, Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { KafkaFilter } from './kafka.filter';

@Controller('kafka')
export class KafkaController {
  constructor(
    @Inject('KAFKA_ODOO_TASK') private readonly client: ClientKafka,
    private emitEvent: EventEmitter2
  ) {}

  @EventPattern('dev-test') // ! use eventpattern instead of messagepattern for no reply needed
  @UsePipes(ValidationPipe)
  @UseFilters(KafkaFilter)
  async devTest(@Payload() task: TaskDto, @Ctx() ctx: KafkaContext): Promise<Record<string, string>> {
    const _t = plainToInstance(Task, task);
    const heartbeat = ctx.getHeartbeat();
    heartbeat(); // TODO review: should await heartbeat() or not?

    // ! Dev testing
    // this.client.emit('dev_1', JSON.stringify({ status: 'ok' }));
    this.emitEvent.emitAsync(EMIT_CREATE_TASK, _t); // ? move to service ?
    return { status: 'ok' };
  }

  @EventPattern('dev_1') // ! use eventpattern instead of messagepattern for no reply needed
  devTestReply(@Payload() messages: any): Record<string, string> {
    console.log('Reply message:', messages);
    return { status: 'ok' };
  }
}
