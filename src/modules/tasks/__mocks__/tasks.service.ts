import { tasksStub } from './task.stub';

const mockTasksService = () => {
  const tasks = tasksStub();
  return {
    pagiation: jest.fn().mockReturnValue(Promise.resolve([tasks, tasks.length])),
    listTasks: jest.fn(),
    createTask: jest.fn(),
    getTask: jest.fn(),
    updateTask: jest.fn(),
    executeTaskDirectly: jest.fn(),
  };
};

export const TasksService = jest.fn().mockReturnValue(mockTasksService());
