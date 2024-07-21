import { HttpStatus as STATUS } from '@nestjs/common';

export class MyException extends Error {
  httpStatus: number;
  code: number;
  error: string | null;
  additional?: object | null;
  constructor(msg?: string, options?: object) {
    super();
    this.httpStatus = STATUS.INTERNAL_SERVER_ERROR;
    if (msg) {
      this.message = msg;
    }
    if (options !== undefined && options !== null) {
      this.additional = options;
    }
  }
}

export class UnAuthorized extends MyException {
  httpStatus = STATUS.UNAUTHORIZED;
  code = this.httpStatus;
  error = 'UNAUTHORIZED';
}

export class WrongLoginInfo extends UnAuthorized {
  error = 'WRONG_LOGIN_INFO';
}

export class NotFound extends MyException {
  httpStatus = STATUS.NOT_FOUND;
  code = this.httpStatus;
  error = 'NOT_FOUND';
}

export class AccountNotFound extends NotFound {
  error = 'ACCOUNT_NOT_FOUND';
}

export class TaskNotFound extends NotFound {
  error = 'TASK_NOT_FOUND';
}

export class MsgNotFound extends NotFound {
  error = 'MSG_NOT_FOUND';
}

export class Conflict extends MyException {
  httpStatus = STATUS.CONFLICT;
  code = this.httpStatus;
  error = 'CONFLICT';
}
export class TaskAlreadyExist extends Conflict {
  error = 'TASK_ALREADY_EXIST';
}

export class AccountAlreadyExist extends Conflict {
  error = 'ACCOUNT_ALREADY_EXIST';
}

// export class LoginFail extends MyException {
//   httpStatus = STATUS.UNAUTHORIZED;
//   code = this.httpStatus;
//   error = 'LOGIN_FAIL';
// }
