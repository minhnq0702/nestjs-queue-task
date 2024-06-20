import { DynamicModule, Module } from '@nestjs/common';

export type ModuleLoaderOptions = {
  loadQueueTask: boolean;
  loadMessageModule: boolean;
};

export type RootAsyncOptions = {
  useFactory: (...args: any[]) => ModuleLoaderOptions | Promise<ModuleLoaderOptions>;
  inject?: any[];
};

@Module({})
export class ModuleLoader {
  static async register(): Promise<DynamicModule> {
    const imports = [];
    if (process.env.LOAD_TASK_MODULE.toUpperCase() === 'TRUE') {
      const { TasksModule } = await import('./tasks/tasks.module');
      imports.push(TasksModule);
    }
    if (process.env.LOAD_MESSAGE_MODULE.toUpperCase() === 'TRUE') {
      const { MessagesModule } = await import('./messages/messages.module');
      imports.push(MessagesModule);
    }

    return {
      module: ModuleLoader,
      imports: imports,
      providers: [],
      exports: []
    };
  }
}
