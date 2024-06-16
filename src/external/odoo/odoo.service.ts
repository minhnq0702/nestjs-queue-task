import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';

type OdooDoingTaskParams = {
  url: string;
  db: string;
  user: string;
  pass: string;
  model: string;
  func: string;
  records: string;
  args: string;
  kwargs: string;
};

@Injectable()
export class OdooService {
  constructor(private readonly logger: LoggerService) {}

  callDoingTask(taskParams: OdooDoingTaskParams) {
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
    fetch(`${url}`, {
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
    })
      .then((res) => {
        this.logger.debug(`Response: ${res}`);
        return res.text();
      })
      .then((text) => {
        this.logger.debug(`Text: ${text}`);
      });
  }
}
