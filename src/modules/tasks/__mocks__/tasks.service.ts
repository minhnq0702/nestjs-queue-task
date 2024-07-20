import { OdooCreateTaskDto } from '@/dto';
import { Types } from 'mongoose';
import { tasksStub } from './task.stub';

const mockTasksService = () => {
  const tasks = tasksStub();
  return {
    pagiation: jest.fn().mockReturnValue(Promise.resolve([tasks, tasks.length])),
    listTasks: jest.fn(),
    createTask: jest.fn().mockImplementation(async (task: OdooCreateTaskDto) => {
      return {
        ...task,
        _id: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        state: 'DRAFT',
      };
    }),
    getTask: jest.fn(),
    updateTask: jest.fn(),
    executeTaskDirectly: jest.fn(),
  };
};

export const TasksService = jest.fn().mockReturnValue(mockTasksService());
