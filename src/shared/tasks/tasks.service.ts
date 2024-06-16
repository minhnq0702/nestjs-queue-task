import { GetDomain } from '@/entities/base.entity';
import { Task, TaskDocument, TaskOperation, TaskStateEnum } from '@/entities/task.entity';
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

  // ? review type Promise<TaskDocument[]>
  async listTasks(): Promise<TaskDocument[]> {
    const res = this.taskModel.find<TaskDocument>();
    res.sort({ createdAt: -1 }); // TODO add sort params
    return res.exec();
  }

  async createTask(task: Task): Promise<Task> {
    return this.taskModel.create(task);
  }

  /** Get task filtered by id */
  async getTask({ filterFields }: TaskOperation): Promise<Task> {
    const domain = GetDomain(filterFields);
    const res = this.taskModel.findOne<Task>(domain);
    return res.exec();
  }

  /** Execute task: Request to external service to execute queued task (Odoo, etc..) */
  async executeTask({ filterFields }: TaskOperation): Promise<Task> {
    const domain = GetDomain(filterFields);
    const res = this.taskModel.findOne<Task>(domain);
    res.where('state', TaskStateEnum.PENDING);
    return res.exec().then((task: TaskDocument) => {
      if (!task) {
        throw new Error('Task not found');
      }
      this.logger.debug(`# TODO: Execute task ${task._id}`);
      return task;
    });
  }
}
