import { TaskDto } from '@/dto/task.dto';
import { Task, TaskDocument } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { Body, Controller, Get, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class TasksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly tasksService: TasksService
  ) {}

  @Get()
  async listTasks(): Promise<TaskDocument[]> {
    this.logger.log('Listing tasks');
    return this.tasksService.listTasks();
  }

  @Post()
  async createTasks(@Body() payload: TaskDto): Promise<Task> {
    this.logger.log('Creating tasks');
    return this.tasksService.createTask({
      model: payload.model,
      func: payload.func,
      args: payload.args,
      kwargs: payload.kwargs
    });
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    this.logger.log('Getting task');
    const task = await this.tasksService.getTask({ id });
    console.log(id);
    if (!task) {
      throw new NotFoundException({
        message: `Task with id ${id.toString()} not found`,
        code: 'TASK_NOT_FOUND'
      });
    }
    return task;
  }
}
