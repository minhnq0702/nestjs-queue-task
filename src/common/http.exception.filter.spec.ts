import { NotFound } from '@/entities/error.entity';
import { HttpStatus } from '@nestjs/common';
import AllExceptionFilter from './http.exception.filter';

const mockGetHttpCtx = jest.fn().mockReturnValue({ getResponse: jest.fn() });

describe('TestFilter', () => {
  let filter: AllExceptionFilter;
  let wrap: jest.SpyInstance;
  beforeEach(() => {
    filter = new AllExceptionFilter({ error: jest.fn() } as any, { httpAdapter: { reply: jest.fn() } } as any);
    wrap = jest.spyOn(filter, 'WrapError');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('GeneralError', () => {
    beforeEach(() => {
      const general_err = new Error('GENERAL_ERROR');
      filter.catch(general_err, { switchToHttp: mockGetHttpCtx } as any);
    });

    it('expect wrap error called', () => {
      expect(wrap).toHaveBeenCalled();
    });

    it('expect wrapped general error to be returned', () => {
      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 1,
        error: 'INTERNAL_SERVER_ERROR',
        message: ['GENERAL_ERROR'],
        timestamp: expect.any(String),
      });
    });
  });

  describe('CustomError', () => {
    beforeEach(() => {
      // const notfound_err = new NotFound('TEST_NOTFOUND');
      // filter.catch(notfound_err, { switchToHttp: mockGetHttpCtx } as any);
    });

    it('expect wrapped notfound custom error to be returned', () => {
      const notfound_err = new NotFound('TEST_NOTFOUND');
      filter.catch(notfound_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.NOT_FOUND,
        code: 404,
        error: 'NOT_FOUND',
        message: ['TEST_NOTFOUND'],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped notfound custom error with additional to be returned', () => {
      const notfound_err = new NotFound('', { your_custom_err: 'TEST_NOTFOUND' });
      filter.catch(notfound_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.NOT_FOUND,
        code: 404,
        error: 'NOT_FOUND',
        message: [],
        additional: { your_custom_err: 'TEST_NOTFOUND' },
        timestamp: expect.any(String),
      });
    });
  });
});
