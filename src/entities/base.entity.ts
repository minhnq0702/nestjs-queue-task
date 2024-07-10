import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseEntity {
  @Prop({ select: false })
  __v?: number;

  // @Prop({ _id: true, select: false })
  // id?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export type BaseFilter<T> = {
  id?: string | Record<'$in', any>;
} & T;

export type BaseSort = Record<string, number>;
