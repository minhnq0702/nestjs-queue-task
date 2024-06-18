import { OdooDoingTaskParams } from '@/dto/odoo.doing.task.dto';
import { TaskStateEnum } from '@/entities/task.entity';
import { LoggerService } from '@/logger/logger.service';
import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueDrained,
  OnQueueFailed,
  OnQueueWaiting,
  Processor
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { TasksService } from '../tasks.service';

@Processor(process.env.ODOO_QUEUE_TASK_CHANNEL)
export class TaskQueueProcessor {
  constructor(
    private readonly logger: LoggerService,
    @InjectQueue(process.env.ODOO_QUEUE_TASK_CHANNEL) private taskQueue: Queue,
    private readonly taskService: TasksService
  ) {}

  // @Process({ concurrency: 5 })
  // async onExecuteJob(job: Job<unknown>) {
  //   console.log(`[${process.pid}]Execute task ${job.id}`);
  //   job.progress(1);
  //   await new Promise((resolve) => {
  //     this.logger.log('Task READLLY EXECUTEDDD');
  //     return setTimeout(() => {
  //       resolve(1);
  //     }, 3000);
  //   });
  //   return { status: 'done' };
  // }

  @OnQueueWaiting()
  async onQueuedTask(jobId: number | string) {
    this.logger.log(`Job queued ${jobId}`);
    this.taskQueue.getJob(jobId).then((job: Job<OdooDoingTaskParams>) => {
      this.taskService.updateTask({
        filterFields: { id: job.data.dbId },
        updateFields: { state: TaskStateEnum.QUEUED }
      });
    });
  }

  @OnQueueActive()
  async onActiveTask(job: Job<OdooDoingTaskParams>) {
    this.logger.log(`Job activated ${job.id}`);
    this.taskService.updateTask({
      filterFields: { id: job.data.dbId },
      updateFields: { state: TaskStateEnum.STARTED }
    });
  }

  @OnQueueCompleted()
  async onCompletedTask(job: Job<OdooDoingTaskParams>, result: any) {
    this.logger.log(`Job completed ${job.id} - ${result}`);
    job.progress(100);
    this.taskService.updateTask({
      filterFields: { id: job.data.dbId },
      updateFields: { state: TaskStateEnum.SUCCESS }
    });
  }

  @OnQueueDrained()
  async onAllJobTask() {
    this.logger.log('Job Queue released');
  }

  @OnQueueFailed()
  async onFailedTask(job: Job<OdooDoingTaskParams>, error: Error) {
    this.logger.error(`Job failed ${job.id} - ${error.message}`, error.stack);
    this.taskService.updateTask({
      filterFields: { id: job.data.dbId },
      updateFields: { state: TaskStateEnum.FAILED }
    });
  }
}
