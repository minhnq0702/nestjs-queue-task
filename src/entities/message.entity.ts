import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseOperate } from './base.entity';

export type MessageDoc = HydratedDocument<Message>;

export enum MessageStateEnum {
  DRAFT = 'draft',
  READY = 'ready',
  QUEUED = 'queued',
  STARTED = 'sent',
  FAILED = 'failed'
}

export type MessageAddInfo = {
  executeDuration?: number;
};

@Schema()
export class Message extends BaseEntity {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ default: null })
  sender: string | null;

  @Prop({ default: false })
  read?: boolean; // * Think about how to implement this feature

  @Prop({ default: null })
  scheduleAt?: Date;

  @Prop({ default: MessageStateEnum.DRAFT })
  state?: string;

  @Prop({ default: null })
  failReason?: string | null;

  @Prop({ default: null })
  providerId?: string;

  @Prop({ type: Object, default: null })
  addInfo?: MessageAddInfo;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageFilter = {
  state?: MessageStateEnum;
};

export type MessageUpdate = {
  state?: MessageStateEnum;
  failReason?: string;
  providerId?: string;
  addInfo?: MessageAddInfo;
};

export type MessageOperation = BaseOperate<MessageFilter, MessageUpdate>;
