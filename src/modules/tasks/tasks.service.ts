import { paginate, PaginateQuery } from '@/common/paginate/paginate';
import { ODOO_CONFIG } from '@/constants';
import { TaskNotFound } from '@/entities/error.entity';
import { Task, TaskDoc, TaskStateEnum } from '@/entities/task.entity';
import { OdooService } from '@/external/odoo.service';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly odooService: OdooService, // ? should change to externalService and use Odoo as a functional service
    // @InjectQueue(process.env.ODOO_QUEUE_TASK_CHANNEL) private taskQueue: Queue,
  ) {}

  async pagiation(filter: FilterQuery<TaskDoc>, paginateQuery: PaginateQuery): Promise<[TaskDoc[], number]> {
    return paginate<TaskDoc, Task>(this.taskModel, filter, paginateQuery);
  }

  async listTasks(filter: FilterQuery<TaskDoc>, limit: number = null): Promise<TaskDoc[]> {
    const res = this.taskModel.find<TaskDoc>(filter, {}, { limit: limit, sort: { createdAt: 'desc' } });
    return res.exec();
  }

  async createTask(task: Task): Promise<TaskDoc> {
    return this.taskModel.create(task);
  }

  /** Get task filtered by query condition */
  async getTask(filter: FilterQuery<TaskDoc>): Promise<TaskDoc> {
    const res = this.taskModel.findOne(filter);
    return res.exec();
  }

  async updateTask(filter: FilterQuery<TaskDoc>, update: UpdateQuery<TaskDoc>): Promise<TaskDoc> {
    const res = this.taskModel.findOneAndUpdate(
      filter,
      {
        ...update,
        $currentDate: {
          updatedAt: true,
        },
      },
      { new: true },
    );
    return res.exec();
  }

  async deleteTaskById(taskId: string): Promise<void> {
    await this.taskModel.deleteOne({ _id: taskId });
  }

  /** Execute task: Request to external service to execute queued task (Odoo, etc..) */
  async executeTaskDirectly(taskId: string): Promise<TaskDoc> {
    // * Only allow find and execute task with state DRAFT
    const res = this.taskModel.findById(taskId);

    return res.exec().then(async (task) => {
      if (!task) {
        throw new TaskNotFound();
      }
      return this.odooService
        .callDoingTask({
          dbId: task._id.toString(),
          url: this.config.get(ODOO_CONFIG.ODOO_URL),
          db: this.config.get(ODOO_CONFIG.ODOO_DB),
          user: this.config.get(ODOO_CONFIG.ODOO_HTTP_USER) || null,
          pass: this.config.get(ODOO_CONFIG.ODOO_HTTP_PASSWORD) || null,
          model: task.model,
          func: task.func,
          records: task.records,
          args: task.args,
          kwargs: task.kwargs,
        })
        .then(() => {
          task.state = TaskStateEnum.SUCCESS;
          this.updateTask({ _id: task._id.toString() }, { state: TaskStateEnum.SUCCESS });
          return task;
        })
        .catch((err) => {
          this.logger.error(`Task ${task._id.toString()} failed`, err.stack);
          task.state = TaskStateEnum.FAILED;
          this.updateTask({ _id: task._id.toString() }, { state: TaskStateEnum.FAILED });
          return task;
        });
    });
  }
}
