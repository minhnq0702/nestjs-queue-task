import { Account, AccountDoc } from '@/entities/account.entity';
import { AccountAlreadyExist } from '@/entities/error.entity';
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
    jest.clearAllMocks();
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

  describe('getAccount', () => {
    let sample: AccountDoc;

    beforeEach(() => {
      sample = accountsStub()[0];
    });

    it('should return an account', async () => {
      const account = await service.getAccount({ _id: sample._id.toString() });
      expect(account).toBeInstanceOf(Object);
    });

    it('get 1 account empty', async () => {
      const res = await service.getAccount({ _id: '#null-value' });
      expect(res).toBeNull();
    });
  });

  describe('create account', () => {
    let sample: Account;
    beforeEach(async () => {
      sample = {
        account: 'acc3',
        email: 'acc3@gmail.com',
        password: 'password',
        role: null,
      };
      jest.clearAllMocks();
    });

    it('should throw error with empty password', async () => {
      await expect(service.createAccount({} as Account)).rejects.toThrow(
        TypeError(
          'The "password" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received undefined',
        ),
      );
    });

    it('should create an account', async () => {
      const hashPasswod = jest.spyOn(service, 'hashPassword');
      const account = await service.createAccount({ ...sample });
      expect(account).toBeInstanceOf(Object);
      expect(hashPasswod).toHaveBeenCalled();
      expect(account.password).not.toEqual(sample.password);
    });

    it('should throw account already exsits', async () => {
      sample = accountsStub()[0];
      await expect(service.createAccount(sample)).rejects.toThrow(AccountAlreadyExist);
    });

    it('should throw unknow error', async () => {
      jest.spyOn(service, 'hashPassword').mockReturnValue(Promise.resolve(''));
      await expect(service.createAccount({} as Account)).rejects.toThrow(Error);
    });
  });

  describe('update account', () => {
    let sample: AccountDoc;
    beforeEach(async () => {
      sample = accountsStub()[0];
    });

    it('should update then return an updated account', async () => {
      const res = await service.updateAccount({ _id: sample._id.toString() }, { account: 'to-update' });
      expect(res).toBeInstanceOf(Object);
      expect(res.account).toEqual('to-update');
      expect(res.updatedAt).toBeDefined();
    });
  });

  describe('delete account', () => {
    let sample: AccountDoc;
    beforeEach(async () => {
      sample = accountsStub()[0];
    });

    it('should delete an account', async () => {
      await expect(service.deleteAccountById(sample._id.toString())).resolves.toBeUndefined();
      expect(mockAccModel.deleteOne).toHaveBeenCalled();
    });
  });
});
