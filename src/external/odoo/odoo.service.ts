import { OdooDoingTaskParams } from '@/dto/odoo.doing.task.dto';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';

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
    const url = `${taskParams.url}?db=${taskParams.db}`;
    return fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: taskParams.model,
        func: taskParams.func,
        records: taskParams.records,
        args: taskParams.args,
        kwargs: taskParams.kwargs
      })
    }).then((res) => {
      this.logger.debug(`Response: ${res.status} ${res.statusText}`);
      // TODO: fix handle error
      return res.text();
    });
  }
}
