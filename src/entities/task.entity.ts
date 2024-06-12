import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from './base.entity';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStateEnum {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

@Schema()
export class Task extends BaseEntity {
  @Prop()
  model: string;

  @Prop()
  func: string;

  @Prop({ default: [] })
  args: Array<string | number | Array<any>>;

  @Prop({ type: Object, default: {} })
  kwargs: Record<string | number, string | number | Array<any>>;

  @Prop({ default: Date.now })
  createdAt?: Date; // TODO should change to ITask ?

  @Prop({ default: Date.now })
  updatedAt?: Date; // TODO should change to ITask ?

  @Prop({ default: TaskStateEnum.PENDING })
  state?: TaskStateEnum;
}

export const TaskSchmea = SchemaFactory.createForClass(Task);
