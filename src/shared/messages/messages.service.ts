import { paginate, PaginateQuery } from '@/common/paginate/paginate';
import { MsgNotFound } from '@/entities/error.entity';
import { Message, MessageDoc, MessageStateEnum } from '@/entities/message.entity';
import { TwilioService } from '@/external/twilio/sms.service';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService,
  ) {}

  async pagiation(filter: FilterQuery<MessageDoc>, paginateQuery: PaginateQuery): Promise<[MessageDoc[], number]> {
    return paginate<MessageDoc, Message>(this.msgModel, filter, paginateQuery);
  }

  /**
   * List messages with filter and limit
   * @param filter MongoFilterQuery
   * @param limit
   * @returns
   */
  async listMsgs(filter: FilterQuery<MessageDoc>, limit: number = null): Promise<MessageDoc[]> {
    const res = this.msgModel.find(filter, {}, { limit: limit, sort: { createdAt: 'desc' } });
    return res.exec();
  }

  async createMsg(task: Message): Promise<MessageDoc> {
    return this.msgModel.create(task);
  }

  /**
   * Get one message filtered by condition
   * @param filter MongoFilterQuery
   * @returns
   */
  async getMsg(filter: FilterQuery<MessageDoc>): Promise<MessageDoc> {
    const res = this.msgModel.findOne(filter);
    return res.exec();
  }

  async updateMsgs(filter: FilterQuery<MessageDoc>, update: UpdateQuery<MessageDoc>): Promise<number> {
    const res = this.msgModel.updateMany(filter, {
      ...update,
      $currentDate: {
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
        this.updateMsgs(
          {
            _id: msg.id,
          },
          { state: MessageStateEnum.QUEUED, providerId: sid },
        );
        return msg;
      })
      .catch(async (err) => {
        await this.updateMsgs(
          { _id: msg.id },
          {
            state: MessageStateEnum.FAILED,
            failReason: err,
          },
        );
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
