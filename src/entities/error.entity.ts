import { HttpStatus as STATUS } from '@nestjs/common';

export class MyException extends Error {
  httpStatus: number;
  code: number;
  error: string | null;
  additional?: object | null;
  constructor(options?: object | string) {
    super();
    if (typeof options === 'string') {
      this.message = options;
    } else if (typeof options === 'object') {
      this.additional = options;
    }
  }
}

export class TaskNotFound extends MyException {
  httpStatus = STATUS.NOT_FOUND;
  code = 404;
  error = 'TASK_NOT_FOUND';
}

export class Conflict extends MyException {
  httpStatus = STATUS.CONFLICT;
  code = this.httpStatus;
  error = 'CONFLICT';
}
export class TaskAlreadyExist extends Conflict {
  error = 'TASK_ALREADY_EXIST';
}

// export class LoginFail extends MyException {
//   httpStatus = STATUS.UNAUTHORIZED;
//   code = this.httpStatus;
//   error = 'LOGIN_FAIL';
// }
