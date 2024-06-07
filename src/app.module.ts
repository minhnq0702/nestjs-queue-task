import { AuthModule } from '@/auth/auth.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // * add schedule module for root app, so all cron jobs in childs module can be run
    LoggerModule.register('RootApp'), // * add logger for root app
    KafkaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
