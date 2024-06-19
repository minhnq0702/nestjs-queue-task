import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseOperate } from './base.entity';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStateEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  QUEUED = 'queued',
  STARTED = 'started',
  SUCCESS = 'success',
  FAILED = 'failed'
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

  @Prop()
  jobId?: string;
}

export const TaskSchmea = SchemaFactory.createForClass(Task);

export type TaskFilter = {
  model?: string;
  func?: string;
  state?: TaskStateEnum;
};

// export type TaskOperation = BaseOperate;
export type TaskOperation = BaseOperate<TaskFilter, object>;
