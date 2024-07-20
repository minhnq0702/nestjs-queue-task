import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from './account.entity';
import { BaseEntity } from './base.entity';

export type TaskDoc = HydratedDocument<Task>;

export enum TaskStateEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  QUEUED = 'queued',
  STARTED = 'started',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Schema()
export class Task extends BaseEntity {
  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  func: string;

  @Prop({ required: true, type: String, default: '[]' })
  args: string;

  @Prop({ required: true, type: String, default: '{}' })
  kwargs: string;

  @Prop({ default: TaskStateEnum.DRAFT })
  state?: TaskStateEnum;

  @Prop({ default: '' })
  records: string;

  @Prop({ type: String, required: true })
  executeUrl: string;

  @Prop()
  jobId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Account.name })
  account?: Account;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
