import OdooExecutor from '@/external/odoo/odoo.executor';
import { DoneCallback, Job } from 'bull';

export default function (job: Job, cb: DoneCallback) {
  const taskParams = job.data;
  OdooExecutor(taskParams).then(
    async (taskDbId) => {
      cb(null, taskDbId);
    },
    async (err) => {
      cb(err);
    },
  );
}
