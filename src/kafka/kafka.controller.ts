import { EMIT_CREATE_TASK } from '@/constants';
import { OdooCreateTaskDto } from '@/dto/task.dto';
import { Task } from '@/entities/task.entity';
import { Controller, Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { KAFKA_CLIENT_REF, KAFKA_ODOO_TOPIC } from './constant';
import { KafkaFilter } from './kafka.filter';

@Controller('kafka')
export class KafkaController {
  constructor(
    @Inject(KAFKA_CLIENT_REF) private readonly client: ClientKafka,
    private emitEvent: EventEmitter2,
  ) {}

  @EventPattern(KAFKA_ODOO_TOPIC) // ! use eventpattern instead of messagepattern for no reply needed
  @UsePipes(ValidationPipe)
  @UseFilters(KafkaFilter)
  async OdooQueueJobTopic(@Payload() task: OdooCreateTaskDto, @Ctx() ctx: KafkaContext) {
    const _t = plainToInstance(Task, task);
    const heartbeat = ctx.getHeartbeat();
    await this.emitEvent.emitAsync(EMIT_CREATE_TASK, _t); // * do not inject taskSvc here in order to get rid of dependency injection here
    heartbeat(); // TODO review: should await heartbeat() or not?
  }
}
