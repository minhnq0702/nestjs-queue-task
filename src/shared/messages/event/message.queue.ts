import { MessageDocument, MessageStateEnum } from '@/entities/message.entity';
import { TwilioService } from '@/external/twilio/sms.service';
import { LoggerService } from '@/logger/logger.service';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MessagesService } from '../messages.service';

@Processor('message.queue.channel')
export class MessageQueueProcessor {
  constructor(
    private readonly logger: LoggerService,
    private readonly twilioSvc: TwilioService,
    private readonly msgSvc: MessagesService
  ) {}

  @Process({ name: 'send-msg', concurrency: 400 })
  async onExecuteJob(job: Job<MessageDocument>) {
    // this.logger.log(`${JSON.stringify(job.data)}`);
    try {
      const sid = await this.twilioSvc.sendSms({
        body: job.data.content,
        to: job.data.receiver,
        from: job.data.sender
      });
      return sid;
    } catch (error) {
      // this.logger.error(`Error onExecuteJob ${error}`);
      throw error;
    }
  }

  @OnQueueCompleted()
  async onCompletedTask(job: Job<MessageDocument>, result: string) {
    // this.logger.log(`[${process.pid}] Job completed ${job.id} - ${result}`);
    await this.msgSvc.updateMsgs({
      filterFields: { id: job.data._id.toString() },
      updateFields: { state: MessageStateEnum.QUEUED, providerId: result, failReason: null }
    });
    job.progress(100);
  }

  @OnQueueFailed()
  async onFailedTask(job: Job<MessageDocument>, error: Error) {
    this.logger.error(`Job failed ${job.id} - ${error}`, error.stack);
    if (
      error.message.startsWith('getaddrinfo') ||
      error.message.startsWith('ETIMEDOUT') ||
      error.message.startsWith('Client network socket disconnected before secure')
    ) {
      await this.msgSvc.updateMsgs({
        filterFields: { id: job.data._id.toString() },
        updateFields: { state: MessageStateEnum.DRAFT, failReason: error.message }
      });
      return;
    } else {
      this.msgSvc.updateMsgs({
        filterFields: { id: job.data._id.toString() },
        updateFields: { state: MessageStateEnum.FAILED, failReason: error.message }
      });
    }
  }
}
