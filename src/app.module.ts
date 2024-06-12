import { AuthModule } from '@/auth/auth.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: false,
      removeListener: false,
      ignoreErrors: false,
      maxListeners: 10,
      wildcard: true,
      verboseMemoryLeak: false
    }), // TODO add event emitter for root app. Review configuartion
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
        dbName: config.get<string>('DB_NAME'),
        user: config.get<string>('DB_USER'),
        pass: config.get<string>('DB_PASSWORD')
      }),
      inject: [ConfigService]
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/', {
    //   dbName: 'dev',
    //   user: 'root',
    //   pass: 'root'
    // }), // * move to factory to inject ConfigService to get env variables
    KafkaModule,
    AuthModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
