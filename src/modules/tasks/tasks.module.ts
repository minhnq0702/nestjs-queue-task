import { Task, TaskSchema } from '@/entities/task.entity';
import { ExternalModule } from '@/external/external.module';
import { LoggerModule } from '@/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { ODOO_CONCURRENCY, ODOO_QUEUE_TASK_CHANNEL } from './constants';
import { TaskCronService } from './event/tasks.cron';
import { TaskQueueProcessor } from './event/tasks.queue';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    LoggerModule.register('TASKS'),
    // BullModule.registerQueueAsync({
    //   useFactory: async (config: ConfigService) => ({
    //     name: config.get<string>(ODOO_CONFIG.ODOO_QUEUE_TASK_CHANNEL),
    //     processors: [
    //       {
    //         concurrency: parseInt(config.get<string>(ODOO_CONFIG.ODOO_CONCURRENCY)) || 5,
    //         path: join(__dirname, '..', '..', 'external', 'odoo', 'processor.js')
    //       }
    //     ]
    //   }),
    //   inject: [ConfigService]
    // }),
    BullModule.registerQueue({
      name: ODOO_QUEUE_TASK_CHANNEL,
      processors: [
        {
          // name: 'task',
          concurrency: ODOO_CONCURRENCY || 5,
          // path: join(__dirname, '..', '..', 'external', 'odoo', 'processor.js'),
          path: path.resolve(__dirname, 'tasks.processor.js'),
        },
      ],
    }),
    ExternalModule,
  ],
  providers: [ConfigService, TaskCronService, TasksService, TaskQueueProcessor],
  controllers: [TasksController],
})
export class TasksModule {}
