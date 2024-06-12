import { LoggerService } from '@/logger/logger.service';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Catch(BadRequestException)
export class KafkaFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToRpc().getContext<KafkaContext>();
    const heartbeat = ctx.getHeartbeat();
    await heartbeat();
    const topic = ctx.getTopic();
    const partition = ctx.getPartition();
    const msg = ctx.getMessage();
    const offset = msg.offset;

    this.logger.error(
      `Validation error on topic ${topic}, partition ${partition}, offset ${offset}: ${exception.message}`,
      exception.stack
    );
  }
}
