import { OdooDoingTaskParams } from '@/dto/event/odoo.doing.task.dto';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import odooExecutor from './odoo.executor';

@Injectable()
export class OdooService {
  constructor(private readonly logger: LoggerService) {}

  async callDoingTask(taskParams: OdooDoingTaskParams) {
    this.logger.debug(`
    Doing task:
      \t- url: ${taskParams.url}
      \t- db: ${taskParams.db} 
      \t- user: ${taskParams.user} 
      \t- pass: ${taskParams.pass} 
      \t- model: ${taskParams.model} 
      \t- func: ${taskParams.func} 
      \t- args: ${taskParams.args} 
      \t- kwargs: ${taskParams.kwargs}
    `);
    return odooExecutor(taskParams);
  }
}
