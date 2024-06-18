import { GetDomain } from '@/entities/base.entity';
import { Message, MessageDocument, MessageOperation } from '@/entities/message.entity';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
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
}
