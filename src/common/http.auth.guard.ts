import { LoggerService } from '@/logger/logger.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC = 'IS_PUBLIC';
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const IS_API_KEY = 'IS_API_KEY';
export const ApiKey = () => SetMetadata(IS_API_KEY, true);

export const IS_JWT_KEY = 'IS_JWT_KEY';
export const JwtKey = () => SetMetadata(IS_JWT_KEY, true);

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      this.logger.debug(`HttpAuthGuard: public access allowed.`);
      return true;
    }

    const isApiKey = this.reflector.getAllAndOverride<boolean>(IS_API_KEY, [context.getHandler(), context.getClass()]);
    const isJwtKey = this.reflector.getAllAndOverride<boolean>(IS_JWT_KEY, [context.getHandler(), context.getClass()]);
    if (!isApiKey && !isJwtKey) {
      this.logger.debug(`HttpAuthGuard: public access allowed.`);
      return true;
    }
    this.logger.debug(`ApiKeyAuthGuard: canActivate() called. ${isPublic} ${isApiKey} ${isJwtKey}`);

    if (isApiKey && this.validateApiKey(req.header('x-api-key'))) {
      return true;
    }

    if (isJwtKey && this.validateJwtToken(this.getTokenFromRequest(req))) {
      return true;
    }

    return true;
  }

  validateApiKey(apiKey: string): boolean {
    console.log('this is api key', apiKey);
    return true;
  }

  validateJwtToken(token: string): boolean {
    console.log('this is jwt token', token);
    return true;
  }

  getTokenFromRequest(req: Request): string {
    const cookies = (req.headers.cookie?.split(';') ?? []).map((c) => c.trim());
    const jwtCookie = cookies.find((c) => c.startsWith('token='));
    const [, token] = jwtCookie?.split('=') || [];
    return token ?? '';
  }
}
