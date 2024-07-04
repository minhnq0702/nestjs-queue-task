import { LoginDto } from '@/dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() payload: LoginDto) {
    console.log(payload);
    this.authSvc.authenticate(payload.login, payload.password);
  }
}
