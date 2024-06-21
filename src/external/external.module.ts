import { OdooService } from '@/external/odoo/odoo.service';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { TwilioService } from './twilio/sms.service';

@Module({
  imports: [LoggerModule.register('External')],
  providers: [OdooService, TwilioService],
  exports: [OdooService, TwilioService],
})
export class ExternalModule {}
