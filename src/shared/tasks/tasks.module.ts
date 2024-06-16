import { Task, TaskSchmea } from '@/entities/task.entity';
import { ExternalModule } from '@/external/external.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchmea }]),
    LoggerModule.register('Shared/Tasks'),
    ExternalModule
  ],
  providers: [ConfigService, TasksService],
  controllers: [TasksController]
})
export class TasksModule {}
