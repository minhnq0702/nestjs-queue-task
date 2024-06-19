import { MessageDocument, MessageStateEnum } from '@/entities/message.entity';
import { LoggerService } from '@/logger/logger.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { MessagesService } from '../messages.service';

@Injectable()
export class MessageCronService {
  constructor(
    private readonly logger: LoggerService,
    @InjectQueue('message.queue.channel') private msgQueue: Queue,
    private readonly msgSvc: MessagesService
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async cronSendMsgs() {
    this.logger.debug(`[${process.pid}] CRON EXECUTE SEND MESSAGES`);
    const msgs = await this.msgSvc.listMsgs<MessageDocument>({
      filterFields: { state: MessageStateEnum.DRAFT },
      limit: 1000
    });
    // * Update msgs to READY right time prepare to send
    await this.msgSvc
      .updateMsgs({
        filterFields: {
          id: { $in: msgs.map((msg) => msg._id.toString()) }
        },
        updateFields: {
          state: MessageStateEnum.READY
        }
      })
      .then(() => {
        for (const msg of msgs) {
          // * Add msg to queue to send
          this.msgQueue.add('send-msg', msg);
          // this.msgSvc.sendMessageDirectly(
          //   {
          //     filterFields: { id: msg._id.toString() }
          //   },
          //   false
          // );
        }
      });
  }
}
