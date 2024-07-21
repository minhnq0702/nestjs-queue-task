import { LoggerService } from '@/logger/logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OdooService } from '../odoo.service';
import { TwilioService } from '../sms.service';
jest.mock('@/logger/logger.service');

let odooService: OdooService;
let twilioService: TwilioService;

describe('OdooService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, OdooService],
    }).compile();

    odooService = module.get<OdooService>(OdooService);
  });

  it('should be defined', () => {
    expect(odooService).toBeDefined();
  });
});

describe('TwilioService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, TwilioService],
    }).compile();

    twilioService = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(twilioService).toBeDefined();
  });
});
