import { Account } from '@/entities/account.entity';
import { LoggerService } from '@/logger/logger.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { accountsStub } from '../__mocks__/account.stub';
import { MockAccountsModel } from '../__mocks__/accounts.model';
import { AccountsService } from '../accounts.service';
jest.mock('@/logger/logger.service');

describe('AccountsService', () => {
  let service: AccountsService;
  const mockAccModel = MockAccountsModel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: getModelToken(Account.name),
          useClass: Model<Account>,
        },
        AccountsService,
      ],
    })
      .overrideProvider(getModelToken(Account.name))
      .useValue(mockAccModel)
      .compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listAccounts', () => {
    it('should return all accounts', async () => {
      const accounts = await service.listAccounts({});
      expect(accounts.length).toEqual(accountsStub().length);
    });

    it('should return accounts paginate', async () => {
      const [data, total] = await service.pagination({}, { page: 1, limit: 1 });
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toEqual(2); // TODO should fix mock for pagination
      expect(total).toEqual(accountsStub().length);
    });
  });
});
