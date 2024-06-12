import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop()
  id?: string;

  @Prop()
  model: string;

  @Prop()
  func: string;

  @Prop({ default: '' })
  args: string;

  @Prop({ default: '' })
  kwargs: string;
}

export const TaskSchmea = SchemaFactory.createForClass(Task);
