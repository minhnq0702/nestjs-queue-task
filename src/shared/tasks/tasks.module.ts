import { ODOO_CONFIG } from '@/constants';
import { Task, TaskSchmea } from '@/entities/task.entity';
import { ExternalModule } from '@/external/external.module';
import { LoggerModule } from '@/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { TaskCronService } from './event/tasks.cron';
import { TaskQueueProcessor } from './event/tasks.queue';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchmea }]),
    LoggerModule.register('Shared/Tasks'),
    BullModule.registerQueueAsync({
      useFactory: async (config: ConfigService) => ({
        name: process.env.ODOO_QUEUE_TASK_CHANNEL,
        processors: [
          {
            // concurrency: 5,
            // name: 'task',
            concurrency: parseInt(config.get<string>(ODOO_CONFIG.ODOO_CONCURRENCY)) || 5,
            path: join(__dirname, '..', '..', 'external', 'odoo', 'processor.js')
          }
        ]
      }),
      inject: [ConfigService]
    }),
    ExternalModule
  ],
  providers: [ConfigService, TaskCronService, TasksService, TaskQueueProcessor],
  controllers: [TasksController]
})
export class TasksModule {}
