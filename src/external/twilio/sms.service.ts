import { TwilioSMSDto } from '@/dto/twilio.sms.dto';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { hrtime } from 'process';
import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

@Injectable()
export class TwilioService {
  client: Twilio;

  constructor(private readonly logger: LoggerService) {
    logger.debug('Initialize TwilioClient');
    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(sms: TwilioSMSDto) {
    try {
      const _start = hrtime();
      await this.client.messages.create({
        ...sms
      });
      this.logger.debug(`TwilioService.sendSms +${hrtime(_start)}s`);
    } catch (error) {
      throw error;
    }
  }
}
