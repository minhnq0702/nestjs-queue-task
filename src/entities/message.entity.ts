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

  @Prop({ default: MessageStateEnum.DRAFT })
  state?: string;

  @Prop({ default: null })
  failReason?: string | null;

  @Prop({ default: null })
  providerId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageFilter = {
  state?: MessageStateEnum;
};

export type MessageUpdate = {
  state?: MessageStateEnum;
  failReason?: string;
  providerId?: string;
};

export type MessageOperation = BaseOperate<MessageFilter, MessageUpdate>;
