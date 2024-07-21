import { TaskDoc } from '@/entities/task.entity';
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
  findOne: ({ _id }: { _id: string }) => {
    const foundTask = tasksStub().find((task) => task._id.toString() === _id) || null;
    return {
      exec: jest.fn().mockReturnValue(foundTask),
    };
  },
  sort: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockReturnValue(MockCount()),
  // create: jest.fn().mockResolvedValue(tasksStub()[0]),
  create: async (val: TaskDoc) => {
    return val;
  },
  findOneAndUpdate: (_: { _id: string }, newTask: TaskDoc) => {
    newTask.updatedAt = new Date();
    return {
      exec: jest.fn().mockResolvedValue(newTask),
    };
  },
}));
