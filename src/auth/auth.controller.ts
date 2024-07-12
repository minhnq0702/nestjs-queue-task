import { LoginDto } from '@/dto';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  @HttpCode(200)
  // use passthrough = true to apply both way @nestjs and @express
  async login(@Body() payload: LoginDto, @Res({ passthrough: true }) resp: Response) {
    const token = await this.authSvc.authenticate(payload.login, payload.password);
    // * use express response to set cookie
    resp.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'lax' });

    // * leave the response to be handled by nestjs
    return 'Logged in successfully!';
  }
}
