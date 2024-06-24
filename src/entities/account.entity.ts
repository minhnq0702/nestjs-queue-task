import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from './base.entity';

export type AccountDoc = HydratedDocument<Account>;

@Schema()
export class Account extends BaseEntity {
  @Prop({
    required: false,
    index: { unique: true, partialFilterExpression: { account: { $exists: true } } },
  })
  account: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: null })
  role: string;

  @Prop({ type: String, required: false, default: null })
  phone?: string | null;

  @Prop({ required: false, default: true })
  active?: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
// AccountSchema.index({ account: 'hashed' }, { unique: true });
