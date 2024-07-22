import { LoggerService } from '@/logger/logger.service';
import { KafkaFilter } from '../kafka.filter';
jest.mock('@/logger/logger.service');

describe('KafkaFilter', () => {
  it('should be defined', () => {
    expect(new KafkaFilter(new LoggerService('TestKafkaFilter'))).toBeDefined();
  });
});
