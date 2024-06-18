import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseOperate } from './base.entity';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStateEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  STARTED = 'STARTED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

@Schema()
export class Task extends BaseEntity {
  @Prop()
  model: string;

  @Prop()
  func: string;

  @Prop({ type: String, default: '[]' })
  args: string;

  @Prop({ type: String, default: '{}' })
  kwargs: string;

  @Prop({ default: Date.now })
  createdAt?: Date; // TODO should change to ITask ?

  @Prop({ default: Date.now })
  updatedAt?: Date; // TODO should change to ITask ?

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
export type TaskOperation = BaseOperate<TaskFilter>;
