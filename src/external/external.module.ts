import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { OdooService } from './odoo/odoo.service';

@Module({
  imports: [LoggerModule.register('External')],
  providers: [OdooService],
  exports: [OdooService]
})
export class ExternalModule {}
