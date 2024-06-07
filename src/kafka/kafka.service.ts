import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaService {
  constructor(private readonly logger: LoggerService) {
    logger.log('KafkaService');
  }
}
