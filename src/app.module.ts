import { AuthModule } from '@/auth/auth.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [LoggerModule.register('RootApp'), KafkaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
