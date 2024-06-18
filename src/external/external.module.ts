import { OdooService } from '@/external/odoo/odoo.service';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule.register('External')],
  providers: [OdooService],
  exports: [OdooService]
})
export class ExternalModule {}
