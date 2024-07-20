import { PaginateResponse } from '@/common/paginate/paginate';
import { OdooCreateTaskDto } from '@/dto';
import { TaskDoc } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { tasksStub } from '../__mocks__/task.stub';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
jest.mock('../tasks.service');

describe('TasksController', () => {
  let taskController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [LoggerService, TasksService],
    }).compile();

    taskController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('GET /tasks', () => {
    describe('when ctrlListTasks is called', () => {
      let res: PaginateResponse<TaskDoc>;
      let tasks: TaskDoc[];

      beforeEach(async () => {
        res = await taskController.ctrlListTasks(10, 1);
        tasks = res.data;
      });

      it('then it should call tasksService', () => {
        expect(tasksService.pagiation).toHaveBeenCalled();
      });

      it('then it should return pagination data', () => {
        const expectedTask = tasksStub();
        expect(res.data).toBeInstanceOf(Array);
        expect(res.count).toEqual(expectedTask.length);
        expect(res.total).toEqual(expectedTask.length);
      });

      it('then it should return tasks', () => {
        expect(tasks.map((t) => t._id)).toEqual(tasksStub().map((t) => t._id));
      });
    });
  });

  describe('POST /tasks', () => {
    describe('when ctrlCreateTask is called', () => {
      let task: TaskDoc;
      let taskCreateDto: OdooCreateTaskDto;

      beforeEach(async () => {
        taskCreateDto = {
          model: 'res.partner',
          func: 'create',
          args: '[]',
          kwargs: '{}',
          records: 'record',
          executeUrl: 'http://localhost:8069',
        };
        task = await taskController.ctrlCreateTask(taskCreateDto);
      });

      it('then it should call tasksService', () => {
        expect(tasksService.createTask).toHaveBeenCalled();
      });

      it('then it should return new task', () => {
        expect(task._id).toBeDefined();
        expect(task).toEqual(expect.objectContaining(taskCreateDto));
      });
    });
  });
});
