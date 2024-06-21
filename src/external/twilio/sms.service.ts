import { TwilioSMSDto } from '@/dto/event/twilio.sms.dto';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

@Injectable()
export class TwilioService {
  client: Twilio;

  constructor(private readonly logger: LoggerService) {
    logger.debug('Initialize TwilioClient');
    this.client = new Twilio(accountSid, authToken);
    this.client.httpClient.defaultTimeout = 15000;
  }

  async sendSms(sms: TwilioSMSDto): Promise<string> {
    try {
      // const _start = hrtime();
      const msg = await this.client.messages.create(
        {
          ...sms
        }
        // (err, message) => {
        //   if (err) {
        //     this.logger.error(`TwilioService.sendSms ${err}`);
        //     throw err;
        //   }
        //   this.logger.debug(`TwilioService.sendSms ${message.sid}`);
        // }
      );
      // this.logger.debug(`TwilioService.sendSms +${hrtime(_start)}s`);
      return msg.sid;
    } catch (error) {
      throw error;
    }
  }
}
