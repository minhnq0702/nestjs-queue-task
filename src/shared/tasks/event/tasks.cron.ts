import { ODOO_CONFIG } from '@/constants';
import { TaskStateEnum } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { TasksService } from '../tasks.service';

export class TaskCronService {
  constructor(
    // @Inject(forwardRef(() => LoggerService)) private readonly logger: LoggerService,
    @InjectQueue(process.env.ODOO_QUEUE_TASK_CHANNEL) private taskQueue: Queue,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly taskService: TasksService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async cronTaskExecute() {
    this.logger.debug(`[${process.pid}] CRON DO SOMETHING`);
    const tasksToDo = await this.taskService.listTasks({
      filterFields: {
        state: TaskStateEnum.DRAFT
      },
      limit: 20
    });
    // console.log('READY?', await this.taskQueue.isReady());
    // if (!(await this.taskQueue.isReady())) {
    //   return;
    // }
    tasksToDo.forEach((task) => {
      this.taskQueue
        .add({
          dbId: task._id.toString(),
          url: this.config.get(ODOO_CONFIG.ODOO_URL),
          db: this.config.get(ODOO_CONFIG.ODOO_DB),
          user: this.config.get(ODOO_CONFIG.ODOO_HTTP_USER) || null,
          pass: this.config.get(ODOO_CONFIG.ODOO_HTTP_PASSWORD) || null,
          model: task.model,
          func: task.func,
          args: task.args,
          kwargs: task.kwargs,
          records: task.records
        })
        .then((job) => {
          this.taskService.updateTask({
            filterFields: { id: task._id.toString() },
            updateFields: { state: TaskStateEnum.PENDING, jobId: job.id }
          });
        });
    });
  }
}
