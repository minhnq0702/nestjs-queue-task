import { Task } from '@/entities/task.entity';
import { OdooService } from '@/external/odoo/odoo.service';
import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TasksService } from '../tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const mockTaskModel: jest.Mock = jest.fn();

  // beforeAll(async () => {
  //   console.log('set before all');
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       LoggerService,
  //       {
  //         provide: getModelToken(Task.name),
  //         useClass: mockTaskModel,
  //       },
  //       ConfigService,
  //       OdooService,
  //       TasksService,
  //     ],
  //   }).compile();

  //   // service = module.get<TasksService>(TasksService);
  //   service = new TasksService(
  //     mockTaskModel as unknown as Model<Task>,
  //     module.get<LoggerService>(LoggerService),
  //     module.get<ConfigService>(ConfigService),
  //     module.get<OdooService>(OdooService),
  //   );
  // });

  beforeEach(async () => {
    console.log('set before each');
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

    const mock = mockTaskModel.mockImplementation(() => ({
      find: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockReturnThis(),
    }))();

    service = new TasksService(
      mock as unknown as Model<Task>,
      module.get<LoggerService>(LoggerService),
      module.get<ConfigService>(ConfigService),
      module.get<OdooService>(OdooService),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list task pagination', async () => {
    const [data, number] = await service.pagiation({}, { page: 1, limit: 10 });
    expect(data).toBeInstanceOf(Array);
    expect(number).toBe(0);
  });

  it('list all tasks success', async () => {
    const res = await service.listTasks({});
    expect(res).toBeInstanceOf(Array);
  });
});
