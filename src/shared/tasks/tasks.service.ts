import { Task, TaskDocument } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly logger: LoggerService
  ) {}

  async listTasks(): Promise<TaskDocument[]> {
    const res = this.taskModel.find<TaskDocument>();
    return res.exec();
  }

  async createTask(task: Task): Promise<Task> {
    return this.taskModel.create(task);
  }

  async getTask({ id }: { id?: string }): Promise<Task> {
    const res = this.taskModel.findOne<Task>({
      _id: id
    });

    this.logger.debug(`Getting task ${res}`);
    return res.exec();
  }
}
