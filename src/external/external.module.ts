import { OdooService } from '@/external/odoo.service';
import { TwilioService } from '@/external/sms.service';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule.register('EXTERNAL')],
  providers: [OdooService, TwilioService],
  exports: [OdooService, TwilioService],
})
export class ExternalModule {}
