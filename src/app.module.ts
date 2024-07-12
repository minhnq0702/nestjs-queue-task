import { AuthModule } from '@/auth/auth.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { AccountsModule } from '@/modules/accounts/accounts.module';
import { ModuleLoader } from '@/modules/module.loader';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { appConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DB_CONFIG } from './constants';

@Module({
  imports: [
    appConfig(), // * add app config
    ScheduleModule.forRoot(), // * add schedule module for root app, so all cron jobs in childs module can be run
    // LoggerModule.register('RootApp'), // * add logger for root app
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: false,
      removeListener: false,
      ignoreErrors: false,
      maxListeners: 10,
      wildcard: true,
      verboseMemoryLeak: false,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>(DB_CONFIG.DB_URI),
        dbName: config.get<string>(DB_CONFIG.DB_NAME),
        user: config.get<string>(DB_CONFIG.DB_USER),
        pass: config.get<string>(DB_CONFIG.DB_PASSWORD),
        // maxPoolSize: 100, // TODO review amount of connection pool
      }),
      inject: [ConfigService],
    }),
    // TODO: check more configuration for bull module
    BullModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get<string>('BULL_REDIS_HOST') || 'localhost',
          port: config.get<number>('BULL_REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    KafkaModule,
    AuthModule,
    AccountsModule,
    ModuleLoader.register(),
  ],
  providers: [Logger, AppService],
  controllers: [AppController],
})
export class AppModule {}
