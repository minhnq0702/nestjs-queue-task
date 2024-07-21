import { AccountSchema } from '@/entities/account.entity';
import { model, Types } from 'mongoose';

const AccountModel = model('Account', AccountSchema);
export const accountsStub = () => {
  return [
    new AccountModel({
      _id: new Types.ObjectId('669b919ade079547e60e133a'),
      account: null,
      email: 'acc1@gmail.com',
      password: 'password',
    }),
    new AccountModel({
      _id: new Types.ObjectId('669149076893a9c273246bea'),
      account: 'acc2',
      email: 'acc2@gmail.com',
      password: 'password',
    }),
  ];
};
