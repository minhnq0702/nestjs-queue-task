import { AccountDoc } from '@/entities/account.entity';
import { MongoServerError } from 'mongodb';
import { accountsStub } from './account.stub';

export const MockCount = jest.fn().mockImplementation(() => ({
  exec: jest.fn().mockResolvedValue(accountsStub().length),
}));
export const MockAccountsModel = jest.fn().mockImplementation(() => ({
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(accountsStub()),
  }),
  findOne: ({ _id }: { _id: string }) => {
    const foundAcc = accountsStub().find((acc) => acc._id.toString() === _id) || null;
    return {
      exec: jest.fn().mockReturnValue(foundAcc),
    };
  },
  create: async (val: AccountDoc) => {
    if (!val.account && !val.email) {
      throw new MongoServerError({ code: 10000 });
    }
    if (
      accountsStub()
        .map((acc) => acc.email)
        .includes(val.email)
    ) {
      throw new MongoServerError({ code: 11000, keyValue: { email: val.email } });
    }
    return val;
  },
  sort: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockReturnValue(MockCount()),
  findOneAndUpdate: (_: { _id: string }, newAcc: AccountDoc) => {
    newAcc.updatedAt = new Date();
    return {
      exec: jest.fn().mockResolvedValue(newAcc),
    };
  },
  deleteOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  }),
}));
