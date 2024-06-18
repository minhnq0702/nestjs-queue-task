import { EMIT_CREATE_TASK } from '@/constants';
import { TaskDto } from '@/dto/task.dto';
import { TaskNotFound } from '@/entities/error.entity';
import { Task } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UsePipes(ValidationPipe)
export class TasksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly tasksService: TasksService
  ) {}

  @Get()
  async ctrlListTasks(): Promise<Task[]> {
    return this.tasksService.listTasks({ filterFields: {} });
  }

  @Post()
  async ctrlCreateTask(@Body() payload: TaskDto): Promise<Task> {
    return this.tasksService.createTask({
      model: payload.model,
      func: payload.func,
      args: payload.args,
      kwargs: payload.kwargs,
      records: payload.records
    });
  }

  @Get(':id')
  async ctrlGetTaskById(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.getTask({ filterFields: { id } });
    if (!task) {
      throw new TaskNotFound(`Task with id ${id.toString()} not found`);
    }
    return task;
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.ACCEPTED)
  async ctrlExecuteTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.executeTaskDirectly({ filterFields: { id } });
  }

  @OnEvent(EMIT_CREATE_TASK, { async: true })
  async eventHandleCreateTask(task: Task): Promise<Task> {
    this.logger.debug(`event emitted ${JSON.stringify(task)}`);
    return this.tasksService.createTask(task);
  }
}
