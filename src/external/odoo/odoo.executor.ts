import { OdooDoingTaskParams } from '@/dto/event/odoo.doing.task.dto';

export default async (taskParams: OdooDoingTaskParams) => {
  const url = `${taskParams.url}?db=${taskParams.db}`;
  return fetch(`${url}`, {
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
  })
    .then(async (res) => {
      const { status, statusText } = res;
      const respText = await res.text();
      if (status !== 200) {
        throw new Error(`Error: ${status} ${statusText} ${respText}`);
      }
      if (respText === 'successfully') {
        return Promise.resolve(taskParams.dbId);
        // return taskParams.dbId;
      } else {
        throw new Error(`Task failed ${respText}`);
      }
    })
    .catch((err) => {
      throw new Error(`Task failed ${err}`);
    });
};
