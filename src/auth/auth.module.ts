import { HttpAuthGuard } from '@/common/http.auth.guard';
import { JWT_SECRET } from '@/constants';
import { LoggerModule } from '@/logger/logger.module';
import { AccountsModule } from '@/modules/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    LoggerModule.register('Auth'),
    JwtModule.registerAsync({
      useFactory: (configSvc: ConfigService) => {
        return {
          global: true,
          secret: configSvc.get<string>(JWT_SECRET),
          signOptions: { expiresIn: '7d' },
        };
      },
      inject: [ConfigService],
    }),
    AccountsModule, // ? Should inject AccountModule here? To de-structure and split microservices, should inject db connection instead
  ],
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
