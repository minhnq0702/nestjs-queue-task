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
  const mockTaskModel: jest.Mock = MockTasksModel();

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list task pagination', async () => {
    const [data, total] = await service.pagiation({}, { page: 1, limit: 1 });
    expect(data).toBeInstanceOf(Array);
    // expect(data.length).toEqual(1);  // TODO should fix mock for pagination
    expect(total).toEqual(tasksStub().length);
  });

  it('list all tasks success', async () => {
    const res = await service.listTasks({});
    expect(res).toBeInstanceOf(Array<TaskDoc>);
    expect(res.length).toEqual(tasksStub().length);
  });

  it('get task success', async () => {
    const res = await service.getTask({});
    expect(res).toBeInstanceOf(Object);
  });

  it('create task success', async () => {
    const res = await service.createTask(tasksStub()[0]);
    expect(res).toBeInstanceOf(Object);
  });
});
