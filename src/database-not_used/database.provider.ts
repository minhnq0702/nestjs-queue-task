import * as mongoose from 'mongoose';

export class DatabaseProvider {}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect('mongodb://root:root@localhost:27017/queued_tasks_dev'),
  },
];
