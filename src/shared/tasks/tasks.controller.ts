import { EMIT_CREATE_TASK } from '@/constants';
import { TaskDto } from '@/dto/task.dto';
import { Task, TaskDocument } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { Body, Controller, Get, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
  async ctrlListTasks(): Promise<TaskDocument[]> {
    this.logger.log('Listing tasks');
    return this.tasksService.listTasks();
  }

  @Post()
  async ctrlCreateTasks(@Body() payload: TaskDto): Promise<Task> {
    this.logger.log('Creating tasks');
    return this.tasksService.createTask({
      model: payload.model,
      func: payload.func,
      args: payload.args,
      kwargs: payload.kwargs
    });
  }

  @Get(':id')
  async ctrlGetTaskById(@Param('id') id: string): Promise<Task> {
    this.logger.log('Getting task');
    const task = await this.tasksService.getTask({ id });
    if (!task) {
      throw new NotFoundException({
        message: `Task with id ${id.toString()} not found`,
        code: 'TASK_NOT_FOUND'
      });
    }
    return task;
  }

  @OnEvent(EMIT_CREATE_TASK)
  async eventHandleCreateTask(task: Task): Promise<Task> {
    console.log(`event emitted==> ${JSON.stringify(task)}`);
    return this.tasksService.createTask(task);
  }
}
