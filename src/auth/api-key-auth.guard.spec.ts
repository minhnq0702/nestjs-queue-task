import { LoggerService } from '@/logger/logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyAuthGuard } from './api-key-auth.guard';

describe('ApiKeyAuthGuard', () => {
  let apiKeyAuthGuard: ApiKeyAuthGuard;

  beforeAll(async () => {
    const loggerModule: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
      exports: [LoggerService]
    }).compile();
    apiKeyAuthGuard = new ApiKeyAuthGuard(loggerModule.get<LoggerService>(LoggerService));
  });

  it('should be defined', () => {
    expect(apiKeyAuthGuard).toBeDefined();
  });
});
