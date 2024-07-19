import OdooExecutor from '@/external/odoo/odoo.executor';
import { DoneCallback, Job } from 'bull';

export default function (job: Job, cb: DoneCallback) {
  const taskParams = job.data;
  OdooExecutor(taskParams)
    .then((taskDbId) => {
      cb(null, taskDbId);
    })
    .catch((err) => {
      console.log('co zo day ko 4?');
      cb(err);
    });
}