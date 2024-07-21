import { TaskSchema, TaskStateEnum } from '@/entities/task.entity';
import { model, Types } from 'mongoose';

const TaskModel = model('Tasks', TaskSchema);
export const tasksStub = () => {
  return [
    new TaskModel({
      _id: new Types.ObjectId('669b919ade079547e60e133a'),
      model: 'task.task',
      func: 'create',
      args: '[]',
      kwargs: '{}',
      state: TaskStateEnum.DRAFT,
      records: '',
      executeUrl: 'http://localhost:8000/api/v1/tasks/execute/',
    }),
    new TaskModel({
      _id: new Types.ObjectId('669b3f046174719aebfd7ba6'),
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
