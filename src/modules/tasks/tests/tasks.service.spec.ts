import { Task, TaskDoc } from '@/entities/task.entity';
import { OdooService } from '@/external/odoo.service';
import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { tasksStub } from '../__mocks__/task.stub';
import { MockTasksModel } from '../__mocks__/tasks.model';
import { TasksService } from '../tasks.service';
jest.mock('@/logger/logger.service');

describe('TasksService', () => {
  let module: TestingModule;
  let taskService: TasksService;
  const mockTaskModel = MockTasksModel();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: getModelToken(Task.name),
          useValue: Model<Task>,
        },
        ConfigService,
        OdooService,
        TasksService,
      ],
    })
      .overrideProvider(getModelToken(Task.name))
      .useValue(mockTaskModel)
      .compile();
  });

  beforeEach(async () => {
    taskService = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('listTasks', () => {
    it('should return all tasks', async () => {
      const tasks = await taskService.listTasks({});
      expect(tasks.length).toEqual(tasksStub().length);
    });

    it('list task pagination', async () => {
      const [data, total] = await taskService.pagiation({}, { page: 1, limit: 1 });
      expect(data).toBeInstanceOf(Array);
      // expect(data.length).toEqual(1);  // TODO should fix mock for pagination
      expect(total).toEqual(tasksStub().length);
    });
  });

  describe('getTask', () => {
    let sample: TaskDoc;
    beforeEach(async () => {
      sample = tasksStub()[0];
    });

    it('get 1 task success', async () => {
      const res = await taskService.getTask({ _id: sample._id.toString() });
      expect(res).toBeInstanceOf(Object);
    });

    it('get 1 task empty', async () => {
      const res = await taskService.getTask({ _id: '#null-value' });
      expect(res).toBeNull();
    });
  });

  describe('create & update task', () => {
    let sample: TaskDoc;
    beforeEach(async () => {
      sample = tasksStub()[0];
    });
    it('create task success', async () => {
      const newTask = await taskService.createTask(tasksStub()[0]);
      expect(newTask).toBeInstanceOf(Object);
      expect(newTask.createdAt).toBeDefined();
    });

    it('update task success', async () => {
      const res = await taskService.updateTask({ _id: sample._id.toString() }, { model: 'new.model' });
      expect(res).toBeInstanceOf(Object);
      expect(res.model).toEqual('new.model');
      expect(res.updatedAt).toBeDefined();
    });
  });
});
