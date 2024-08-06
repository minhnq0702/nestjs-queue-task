import { MessageDoc, MessageStateEnum } from '@/entities/message.entity';
import { TwilioService } from '@/external/sms.service';
import { LoggerService } from '@/logger/logger.service';
import { TWILIO_QUEUE_MSG_CHANNEL, TWILIO_QUEUE_MSG_CONCURRENCY } from '@/modules/messages/constants';
import { MessagesService } from '@/modules/messages/messages.service';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(TWILIO_QUEUE_MSG_CHANNEL)
export class MessageQueueProcessor {
  constructor(
    private readonly logger: LoggerService,
    private readonly twilioSvc: TwilioService,
    private readonly msgSvc: MessagesService,
  ) {}

  @Process({ name: 'send-msg', concurrency: TWILIO_QUEUE_MSG_CONCURRENCY || 300 })
  async onExecuteJob(job: Job<MessageDoc>) {
    // this.logger.log(`${JSON.stringify(job.data)}`);
    try {
      const sid = await this.twilioSvc.sendSms({
        body: job.data.content,
        to: job.data.receiver,
        from: job.data.sender,
      });
      return sid;
    } catch (error) {
      throw error;
    }
  }

  @OnQueueCompleted()
  async onCompletedTask(job: Job<MessageDoc>, result: string) {
    // this.logger.log(`[${process.pid}] Job completed ${job.id} - ${result}`);
    await this.msgSvc.updateMsgs(
      { _id: job.data._id.toString() },
      {
        state: MessageStateEnum.QUEUED,
        providerId: result,
        failReason: null,
        addInfo: { executeDuration: job.finishedOn - job.processedOn },
      },
    );
    // job.progress(100);
  }

  @OnQueueFailed()
  async onFailedTask(job: Job<MessageDoc>, error: Error) {
    this.logger.error(`Job failed ${job.id} - ${error}`, error.stack);
    if (
      error.message == 'Too Many Requests' ||
      error.message.startsWith('getaddrinfo') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ECONNRESET') ||
      error.message.startsWith('timeout of') ||
      error.message.startsWith('Client network socket disconnected before secure')
    ) {
      await this.msgSvc.updateMsgs(
        { _id: job.data._id.toString() },
        { state: MessageStateEnum.DRAFT, failReason: error.message },
      );
      return;
    } else {
      this.msgSvc.updateMsgs(
        { _id: job.data._id.toString() },
        { state: MessageStateEnum.FAILED, failReason: error.message },
      );
    }
  }
}
