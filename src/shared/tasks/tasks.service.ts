import { Task } from '@/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async listTasks(): Promise<Task[]> {
    return this.taskModel.find();
  }

  async createTask(task: Task): Promise<Task> {
    return this.taskModel.create(task);
  }
}
