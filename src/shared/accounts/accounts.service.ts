import { paginate, PaginateQuery, PaginateResult } from '@/common/paginate/paginate';
import { Account, AccountDoc } from '@/entities/account.entity';
import { AccountAlreadyExist } from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accModel: Model<Account>,
    private readonly logger: LoggerService,
  ) {}

  async pagination(query: FilterQuery<AccountDoc>, paginateQuery: PaginateQuery): Promise<PaginateResult<AccountDoc>> {
    return paginate<AccountDoc, Account>(this.accModel, query, paginateQuery);
  }

  async listAccounts(filter: FilterQuery<AccountDoc>, limit: number = null): Promise<AccountDoc[]> {
    const res = this.accModel.find(filter, {}, { limit: limit });
    return res.exec();
  }

  async getAccount(filter: FilterQuery<AccountDoc>): Promise<AccountDoc> {
    return this.accModel.findOne(filter).exec();
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

  async updateAccount(filter: FilterQuery<AccountDoc>, updateQuery: UpdateQuery<AccountDoc>): Promise<AccountDoc> {
    this.accModel.findOneAndUpdate(filter, {
      ...updateQuery,
      $currentDate: {
        updatedAt: true,
      },
    });
    return null;
  }

  async deleteAccountById(accountId: string): Promise<void> {
    await this.accModel.deleteOne({ _id: accountId });
  }
}
