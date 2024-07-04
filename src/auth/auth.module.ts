import { HttpAuthGuard } from '@/common/http.auth.guard';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [LoggerModule.register('Auth')],
  providers: [
    AuthService,
    {
      provide: APP_GUARD, // * Register auth guard for global
      useClass: HttpAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
