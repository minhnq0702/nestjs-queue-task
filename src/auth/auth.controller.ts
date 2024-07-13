import { JwtKey, Public } from '@/auth/auth.guard';
import { LoginDto, ProfileDto } from '@/dto';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Public()
  // use passthrough = true to apply both way @nestjs and @express
  async ctrlLogin(@Body() payload: LoginDto, @Res({ passthrough: true }) resp: Response) {
    const token = await this.authSvc.authenticate(payload.login, payload.password);
    // * use express response to set cookie
    resp.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    // * leave the response to be handled by nestjs
    return {
      message: 'Login success',
      token,
    };
  }

  @Get('profile')
  @JwtKey()
  async ctrlGetProfile(@Req() req: Request): Promise<ProfileDto> {
    return this.authSvc.getProfile(req.accInfo).then((res) => {
      return plainToInstance(ProfileDto, res.toObject(), { excludeExtraneousValues: true });
    });
  }
}
