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
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  }),
  create: jest.fn().mockResolvedValue({}),
  sort: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockReturnValue(MockCount()),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  }),
}));
