import { TaskSchema, TaskStateEnum } from '@/entities/task.entity';
import { model, Types } from 'mongoose';

const TaskModel = model('Person', TaskSchema);
export const tasksStub = () => {
  return [
    new TaskModel({
      _id: new Types.ObjectId(),
      model: 'task.task',
      func: 'create',
      args: '[]',
      kwargs: '{}',
      state: TaskStateEnum.DRAFT,
      records: '',
      executeUrl: 'http://localhost:8000/api/v1/tasks/execute/',
    }),
    new TaskModel({
      _id: new Types.ObjectId(),
      model: 'task.task',
      func: 'create',
      args: '[]',
      kwargs: '{}',
      state: TaskStateEnum.DRAFT,
      records: '',
      executeUrl: 'http://localhost:8000/api/v1/tasks/execute/',
    }),
  ];
};
