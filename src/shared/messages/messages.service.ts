import { GetDomain } from '@/entities/base.entity';
import { MsgNotFound } from '@/entities/error.entity';
import { Message, MessageDocument, MessageOperation, MessageStateEnum } from '@/entities/message.entity';
import { TwilioService } from '@/external/twilio/sms.service';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService
  ) {}

  async listMsgs({ filterFields, limit = null }: MessageOperation): Promise<MessageDocument[]> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.find<MessageDocument>(domain);
    res.sort({ createdAt: -1 }); // TODO add sort params
    if (limit) {
      res.limit(limit);
    }
    return res.exec();
  }

  async createMsg(task: Message): Promise<MessageDocument> {
    return this.msgModel.create(task);
  }

  /** Get task filtered by id */
  async getMsg({ filterFields }: MessageOperation): Promise<MessageDocument> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.findOne<MessageDocument>(domain);
    return res.exec();
  }

  async updateTask({ filterFields, updateFields }: MessageOperation): Promise<MessageDocument> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.findOneAndUpdate<MessageDocument>(
      domain,
      {
        ...updateFields,
        updatedAt: new Date()
      },
      { new: true }
    );
    return res.exec();
  }

  async sendMessageDirectly({ filterFields }: MessageOperation): Promise<Message> {
    const domain = GetDomain(filterFields);
    // * Only allow find and execute task with state DRAFT
    const res = this.msgModel.findOne<MessageDocument>({
      ...domain,
      state: MessageStateEnum.DRAFT
    });

    const msg = await res.exec();
    if (!msg) {
      throw new MsgNotFound(`Message with id ${filterFields.id} not found`);
    }
    return this.twilioService
      .sendSms({
        body: msg.content,
        to: msg.receiver,
        from: msg.sender
      })
      .then(() => {
        return msg;
      })
      .catch((err) => {
        throw new Error(err);
      });
    // return msg;
  }
}
