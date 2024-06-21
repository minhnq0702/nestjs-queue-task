import { OdooDoingTaskParams } from '@/dto/event/odoo.doing.task.dto';
import { DoneCallback, Job } from 'bull';

export default function (job: Job<OdooDoingTaskParams>, cb: DoneCallback) {
  const taskParams = job.data;
  const url = `${taskParams.url}?db=${taskParams.db}`;
  fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: taskParams.model,
      func: taskParams.func,
      records: taskParams.records,
      args: taskParams.args,
      kwargs: taskParams.kwargs,
    }),
  }).then(
    async (res) => {
      // ? how to log this?
      // this.logger.debug(`Response: ${res.status} ${res.statusText}`);
      const { status, statusText } = res;
      const respText = await res.text();
      if (status !== 200) {
        cb(new Error(`Error: ${status} ${statusText} ${respText}`));
      }
      if (respText === 'successfully') {
        cb(null, taskParams.dbId);
      } else {
        cb(new Error('Task failed'));
      }
      // return res.text();
    },
    async (err) => {
      cb(new Error(`Task failed ${err}`));
      // return err;
    },
  );
}
