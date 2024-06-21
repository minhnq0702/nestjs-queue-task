import { GetDomain } from '@/entities/base.entity';
import { MsgNotFound } from '@/entities/error.entity';
import { Message, MessageDoc, MessageOperation, MessageStateEnum } from '@/entities/message.entity';
import { TwilioService } from '@/external/twilio/sms.service';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService,
  ) {}

  async listMsgs(filter: FilterQuery<MessageDoc>, limit: number = null): Promise<MessageDoc[]> {
    const res = this.msgModel.find(filter, {}, { limit: limit, sort: { createdAt: 'desc' } });
    return res.exec();
  }

  async createMsg(task: Message): Promise<MessageDoc> {
    return this.msgModel.create(task);
  }

  /** Get one message filtered by condition */
  async getMsg({ filterFields }: MessageOperation): Promise<MessageDoc> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.findOne(domain);
    return res.exec();
  }

  async updateMsgs({ filterFields, updateFields }: MessageOperation): Promise<number> {
    const domain = GetDomain(filterFields);
    const res = this.msgModel.updateMany(domain, {
      ...updateFields,
      $currentDate: {
        // lastModified: true,
        // updatedAt: { $type: 'date' }
        updatedAt: true,
      },
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

  async sendMsgDirectly(msgId: string): Promise<MessageDoc> {
    // * Only allow find and execute task with state DRAFT
    const res = this.msgModel.findById(msgId);

    const msg = await res.exec();
    if (!msg) {
      throw new MsgNotFound(`Message with id ${msgId} not found`);
    }
    if (msg.state !== MessageStateEnum.DRAFT) {
      throw new Error(`Can not send message is not in DRAFT state`);
    }
    return this.twilioService
      .sendSms({
        body: msg.content,
        to: msg.receiver,
        from: msg.sender,
      })
      .then((sid) => {
        this.updateMsgs({
          filterFields: { id: msg.id },
          updateFields: { state: MessageStateEnum.QUEUED, providerId: sid },
        });
        return msg;
      })
      .catch((err) => {
        this.updateMsgs({
          filterFields: { id: msg.id },
          updateFields: {
            state: MessageStateEnum.FAILED,
            failReason: err,
          },
        });
        throw new Error(err);
      });
  }

  async getMsgToSendByCron(): Promise<MessageDoc[]> {
    return this.listMsgs({
      $and: [
        {
          state: MessageStateEnum.DRAFT,
        },
        {
          $or: [
            {
              scheduleAt: {
                $lt: new Date(),
              },
            },
            {
              scheduleAt: {
                $eq: null,
              },
            },
          ],
        },
      ],
    });
  }
}
