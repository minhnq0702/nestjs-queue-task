import { ODOO_CONFIG } from '@/constants';
import { GetDomain } from '@/entities/base.entity';
import { TaskNotFound } from '@/entities/error.entity';
import { Task, TaskDoc, TaskOperation, TaskStateEnum } from '@/entities/task.entity';
import { OdooService } from '@/external/odoo/odoo.service';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    // @InjectQueue(process.env.ODOO_QUEUE_TASK_CHANNEL) private taskQueue: Queue,
    private readonly odooService: OdooService, // ? should change to externalService and use Odoo as a functional service
  ) {}

  // ? review type Promise<TaskDocument[]>
  async listTasks({ filterFields, limit = null }: TaskOperation): Promise<TaskDoc[]> {
    const domain = GetDomain(filterFields);
    const res = this.taskModel.find<TaskDoc>(domain, {}, { limit: limit, sort: { createdAt: 'desc' } });
    return res.exec();
  }

  async createTask(task: Task): Promise<TaskDoc> {
    return this.taskModel.create(task);
  }

  /** Get task filtered by id */
  async getTask({ filterFields }: TaskOperation): Promise<TaskDoc> {
    const domain = GetDomain(filterFields);
    const res = this.taskModel.findOne(domain);
    return res.exec();
  }

  async updateTask({ filterFields, updateFields }: TaskOperation): Promise<TaskDoc> {
    const domain = GetDomain(filterFields);
    const res = this.taskModel.findOneAndUpdate(
      domain,
      {
        ...updateFields,
        $currentDate: {
          updatedAt: true,
        },
      },
      { new: true },
    );
    return res.exec();
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
          this.updateTask({
            filterFields: { id: task._id.toString() },
            updateFields: { state: TaskStateEnum.SUCCESS },
          });
          return task;
        })
        .catch((err) => {
          this.logger.error(`Task ${task._id.toString()} failed`, err.stack);
          task.state = TaskStateEnum.FAILED;
          this.updateTask({
            filterFields: { id: task._id.toString() },
            updateFields: { state: TaskStateEnum.FAILED },
          });
          return task;
        });
    });
  }
}
