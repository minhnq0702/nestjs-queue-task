import { Task, TaskDoc } from '@/entities/task.entity';
import { OdooService } from '@/external/odoo/odoo.service';
import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MockTasksModel } from '../__mocks__/mock.tasks.model';
import { tasksStub } from '../__mocks__/task.stub';
import { TasksService } from '../tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const mockTaskModel = MockTasksModel();

  beforeAll(async () => {});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: getModelToken(Task.name),
          useValue: Model,
        },
        ConfigService,
        OdooService,
        TasksService,
      ],
    }).compile();

    service = new TasksService(
      mockTaskModel as unknown as Model<Task>,
      module.get<LoggerService>(LoggerService),
      module.get<ConfigService>(ConfigService),
      module.get<OdooService>(OdooService),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listTasks', () => {
    it('should return all tasks', async () => {
      const tasks = await service.listTasks({});
      expect(tasks.length).toEqual(tasksStub().length);
    });

    it('list task pagination', async () => {
      const [data, total] = await service.pagiation({}, { page: 1, limit: 1 });
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
      const res = await service.getTask({ _id: sample._id.toString() });
      expect(res).toBeInstanceOf(Object);
    });

    it('get 1 task empty', async () => {
      const res = await service.getTask({ _id: '#null-value' });
      expect(res).toBeNull();
    });
  });

  describe('create & update task', () => {
    let sample: TaskDoc;
    beforeEach(async () => {
      sample = tasksStub()[0];
    });
    it('create task success', async () => {
      const newTask = await service.createTask(tasksStub()[0]);
      expect(newTask).toBeInstanceOf(Object);
      expect(newTask.createdAt).toBeDefined();
    });

    it('update task success', async () => {
      const res = await service.updateTask({ _id: sample._id.toString() }, { model: 'new.model' });
      expect(res).toBeInstanceOf(Object);
      expect(res.model).toEqual('new.model');
      expect(res.updatedAt).toBeDefined();
    });
  });
});
