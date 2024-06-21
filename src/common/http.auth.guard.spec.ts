import { LoggerService } from '@/logger/logger.service';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpAuthGuard } from './http.auth.guard';

describe('HttpAuthGuard', () => {
  let apiKeyAuthGuard: HttpAuthGuard;

  beforeAll(async () => {
    const loggerModule: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
      exports: [LoggerService]
    }).compile();
    apiKeyAuthGuard = new HttpAuthGuard(loggerModule.get<LoggerService>(LoggerService), new Reflector());
  });

  it('should be defined', () => {
    expect(apiKeyAuthGuard).toBeDefined();
  });
});
