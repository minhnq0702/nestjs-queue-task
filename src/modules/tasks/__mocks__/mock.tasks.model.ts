import { tasksStub } from './task.stub';

export const MockCount = jest.fn().mockImplementation(() => ({
  exec: jest.fn().mockResolvedValue(tasksStub().length),
}));
export const MockTasksModel = jest.fn().mockImplementation(() => ({
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(tasksStub()),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue({}),
  }),
  sort: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockReturnValue(MockCount()),
  create: jest.fn().mockResolvedValue(tasksStub()[0]),
}));
