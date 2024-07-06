import { MessageDoc, MessageStateEnum } from '@/entities/message.entity';
import { LoggerService } from '@/logger/logger.service';
import { TWILIO_QUEUE_MSG_CHANNEL } from '@/shared/messages/constants';
import { MessagesService } from '@/shared/messages/messages.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class MessageCronService {
  constructor(
    private readonly logger: LoggerService,
    @InjectQueue(TWILIO_QUEUE_MSG_CHANNEL) private msgQueue: Queue,
    private readonly msgSvc: MessagesService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async cronSendMsgs() {
    this.logger.debug(`[${process.pid}] CRON EXECUTE SEND MESSAGES`);
    let msgs: MessageDoc[];
    try {
      msgs = await this.msgSvc.getMsgToSendByCron();
    } catch (err) {
      this.logger.error(`Error in cron running to messages to send ${err}`, err.stack);
      return;
    }

    // * Update msgs to READY right time prepare to send
    return this.msgSvc
      .updateMsgs(
        {
          id: { $in: msgs.map((msg) => msg._id.toString()) },
        },
        {
          state: MessageStateEnum.READY,
        },
      )
      .then(() => msgs.map((msg) => this.msgQueue.add('send-msg', msg)))
      .catch((err) => this.logger.error(`Error on update message to ready before sent ${err}`, err.stack));
  }
}
