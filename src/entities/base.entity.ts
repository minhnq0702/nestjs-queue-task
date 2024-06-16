import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseEntity {
  @Prop({ select: false })
  __v?: number;
}

export type BaseFilter<T> = {
  id?: string;
} & T;

export type BaseSort = Record<string, number>;

export type BaseOperate<T> = {
  filterFields: BaseFilter<T>;
  sortFields?: Record<string, number>;
};

export const GetDomain = <T>(options: BaseFilter<T>) => {
  const domain = {};
  Object.keys(options).forEach((key) => {
    if (key === 'id') domain['_id'] = options[key];
    else domain[key] = options[key];
  });
  return domain;
};
