import {
  AccountAlreadyExist,
  AccountNotFound,
  MsgNotFound,
  MyException,
  TaskAlreadyExist,
  TaskNotFound,
  WrongLoginInfo,
} from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { HttpStatus } from '@nestjs/common';
import AllExceptionFilter from './http.exception.filter';

jest.mock('@/logger/logger.service');
const mockGetHttpCtx = jest.fn().mockReturnValue({ getResponse: jest.fn() });

describe('TestFilter', () => {
  let filter: AllExceptionFilter;
  let wrap: jest.SpyInstance;
  beforeEach(() => {
    filter = new AllExceptionFilter(new LoggerService(''), { httpAdapter: { reply: jest.fn() } } as any);
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

  describe('Custom Error', () => {
    beforeEach(() => {
      // const notfound_err = new NotFound('TEST_NOTFOUND');
      // filter.catch(notfound_err, { switchToHttp: mockGetHttpCtx } as any);
    });

    // it('expect wrapped unauthorized custom error to be returned', () => {
    //   const unauthorized_err = new UnAuthorized();
    //   filter.catch(unauthorized_err, { switchToHttp: mockGetHttpCtx } as any);

    //   expect(wrap).toHaveReturnedWith({
    //     statusCode: HttpStatus.UNAUTHORIZED,
    //     code: 401,
    //     error: 'UNAUTHORIZED',
    //     message: [],
    //     timestamp: expect.any(String),
    //   });
    // });

    it('expect wrapped wrong login info custom error to be returned', () => {
      const wronglogin_err = new WrongLoginInfo();
      filter.catch(wronglogin_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: 401,
        error: 'WRONG_LOGIN_INFO',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped account notfound custom error to be returned', () => {
      const acc_notfound_err = new AccountNotFound();
      filter.catch(acc_notfound_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.NOT_FOUND,
        code: 404,
        error: 'ACCOUNT_NOT_FOUND',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped task notfound custom error to be returned', () => {
      const task_notfound_err = new TaskNotFound();
      filter.catch(task_notfound_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.NOT_FOUND,
        code: 404,
        error: 'TASK_NOT_FOUND',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped msg notfound custom error to be returned', () => {
      const msg_notfound_err = new MsgNotFound();
      filter.catch(msg_notfound_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.NOT_FOUND,
        code: 404,
        error: 'MSG_NOT_FOUND',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped task conflict custom error to be returned', () => {
      const task_exists_err = new TaskAlreadyExist();
      filter.catch(task_exists_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.CONFLICT,
        code: 409,
        error: 'TASK_ALREADY_EXIST',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped account conflict custom error to be returned', () => {
      const acc_exists_err = new AccountAlreadyExist();
      filter.catch(acc_exists_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.CONFLICT,
        code: 409,
        error: 'ACCOUNT_ALREADY_EXIST',
        message: [],
        timestamp: expect.any(String),
      });
    });

    it('expect wrapped custom error with additional to be returned', () => {
      const custom_err = new MyException('custom', { your_custom_err: 'TEST_CUSTOM' });
      filter.catch(custom_err, { switchToHttp: mockGetHttpCtx } as any);

      expect(wrap).toHaveReturnedWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: ['custom'],
        additional: { your_custom_err: 'TEST_CUSTOM' },
        timestamp: expect.any(String),
      });
    });
  });
});
