import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseEntity {
  @Prop({ select: false })
  __v?: number;
}
