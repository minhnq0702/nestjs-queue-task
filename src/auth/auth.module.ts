import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyAuthGuard } from './api-key-auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [LoggerModule.register('Auth')],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // * Register auth guard for global
      useClass: ApiKeyAuthGuard
    }
  ]
})
export class AuthModule {}
