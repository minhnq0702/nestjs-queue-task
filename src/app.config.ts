import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export const appConfig = (): DynamicModule => {
  return ConfigModule.forRoot({
    envFilePath: ['.env', '.env.local'],
    isGlobal: true, // * Make the configuration global
    cache: true // * Enable configuration caching
  });
};
