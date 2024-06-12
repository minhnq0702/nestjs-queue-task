import { AuthModule } from '@/auth/auth.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { appConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './shared/tasks/tasks.module';

@Module({
  imports: [
    appConfig(), // * add app config
    ScheduleModule.forRoot(), // * add schedule module for root app, so all cron jobs in childs module can be run
    LoggerModule.register('RootApp'), // * add logger for root app
    KafkaModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/', {
      dbName: 'queued_tasks_dev',
      user: 'root',
      pass: 'root'
    }), // TODO move to factory
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
