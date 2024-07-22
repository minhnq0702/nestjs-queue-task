import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
// jest.mock('./logger.service');

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log object', () => {
    const info = jest.spyOn(service['logger'], 'info');
    service.log({ message: 'LOG' });
    expect(info).toHaveBeenCalled();
  });

  it('log func should be defined', () => {
    const info = jest.spyOn(service['logger'], 'info');
    service.log('LOG');
    expect(info).toHaveBeenCalled();

    const err = jest.spyOn(service['logger'], 'error');
    service.error('ERROR');
    expect(err).toHaveBeenCalled();

    const debug = jest.spyOn(service['logger'], 'debug');
    service.debug('DEBUG');
    expect(debug).toHaveBeenCalled();

    const warn = jest.spyOn(service['logger'], 'warn');
    service.warn('WARN');
    expect(warn).toHaveBeenCalled();
  });
});
