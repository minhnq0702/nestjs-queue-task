import { Account, AccountDoc } from '@/entities/account.entity';
import { AccountAlreadyExist } from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accModel: Model<Account>,
    private readonly logger: LoggerService,
  ) {}

  async listAccounts(filter: FilterQuery<AccountDoc>, limit: number = null): Promise<AccountDoc[]> {
    const res = this.accModel.find(filter, {}, { limit: limit });
    return res.exec();
  }

  async createAccount(account: Account): Promise<AccountDoc> {
    return this.accModel.create(account).catch((err: MongoServerError) => {
      if (!(err instanceof MongoServerError)) throw err;
      if (err.code === 11000) {
        // TODO ? should change to exception filter for MongoError
        throw new AccountAlreadyExist(err.keyValue);
      }
      throw err;
    });
  }
}
