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

  async listMsgs<T extends Message | Message>({ filterFields, limit = null }: MessageOperation): Promise<T[]> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.find<T>(domain);
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

  async updateMsgs({ filterFields, updateFields }: MessageOperation): Promise<number> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.updateMany<MessageDocument>(domain, {
      ...updateFields,
      $currentDate: {
        lastModified: true,
        updatedAt: { $type: 'date' }
      }
    });
    return res
      .exec()
      .then((res) => {
        return res.modifiedCount;
        // return this.getMsg({ filterFields });
      })
      .catch((err) => {
        this.logger.error(`Error updateMsgs ${err}`);
        // throw new Error(err);
        return 0;
      });
  }

  async sendMessageDirectly(
    { filterFields }: MessageOperation,
    toSendMsg: null | MessageDocument = null,
    isThrow = true
  ): Promise<Message> {
    if (!toSendMsg) {
      const domain = GetDomain(filterFields);
      // * Only allow find and execute task with state DRAFT
      const res = this.msgModel.findOne<MessageDocument>({
        ...domain
        // state: MessageStateEnum.DRAFT
      });

      const toSendMsg = await res.exec();
      if (!toSendMsg) {
        if (!isThrow) {
          return null;
        }
        throw new MsgNotFound(`Message with id ${filterFields.id} not found`);
      }
    }
    return this.twilioService
      .sendSms({
        body: toSendMsg.content,
        to: toSendMsg.receiver,
        from: toSendMsg.sender
      })
      .then((sid) => {
        this.updateMsgs({
          filterFields: { id: toSendMsg.id },
          updateFields: { state: MessageStateEnum.QUEUED, providerId: sid }
        });
        return toSendMsg;
      })
      .catch((err) => {
        this.updateMsgs({
          filterFields: { id: toSendMsg.id },
          updateFields: {
            state: MessageStateEnum.FAILED,
            failReason: err
          }
        });
        if (isThrow) {
          throw new Error(err);
        } else {
          return toSendMsg;
        }
      });
  }
}
