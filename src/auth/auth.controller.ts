import { LoginDto } from '@/dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  // @HttpCode(200)
  async login(@Body() payload: LoginDto) {
    console.log(payload);
    await this.authSvc.authenticate(payload.login, payload.password);
  }
}
