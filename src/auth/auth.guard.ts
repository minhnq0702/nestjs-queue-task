import { LoggerService } from '@/logger/logger.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AuthService } from '@/auth/auth.service';
import { SignPayloadDto } from '@/dto';
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
    private readonly authSvc: AuthService,
    private reflector: Reflector,
  ) {}
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

    if (isApiKey) {
      return this.validateApiKey(this.getApiKeyFromRequest(req));
    }

    if (isJwtKey) {
      return this.validateJwtToken(this.getTokenFromRequest(req)).then(([payload, isValid]) => {
        if (isValid) {
          req.accInfo = payload;
        }
        return isValid;
      });
    }

    return true;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    console.log('this is api key', apiKey);
    return true;
  }

  getApiKeyFromRequest(req: Request): string {
    return req.header('x-api-key') ?? '';
  }

  async validateJwtToken(token: string): Promise<[SignPayloadDto, boolean]> {
    return this.authSvc.verify_JWT(token);
  }

  getTokenFromRequest(req: Request): string {
    const cookies = (req.headers.cookie?.split(';') ?? []).map((c) => c.trim());
    const jwtCookie = cookies.find((c) => c.startsWith('token='));
    const [, token] = jwtCookie?.split('=') || [];
    return token ?? '';
  }
}
