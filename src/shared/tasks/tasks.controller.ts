import { TaskDto } from '@/dto/task.dto';
import { Task } from '@/entities/task';
import { LoggerService } from '@/logger/logger.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class TasksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly tasksService: TasksService
  ) {}

  @Get()
  async listTasks(): Promise<Task[]> {
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
}
