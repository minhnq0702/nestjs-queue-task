import { paginate, PaginateQuery as PagiQuery, PaginateResult as PagiRes } from '@/common/paginate/paginate';
import { Account, AccountDoc } from '@/entities/account.entity';
import { AccountAlreadyExist } from '@/entities/error.entity';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { MongoServerError } from 'mongodb';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accModel: Model<Account>,
    private readonly logger: LoggerService,
  ) {}

  async pagination(query: FilterQuery<AccountDoc>, paginateQuery: PagiQuery): Promise<PagiRes<AccountDoc>> {
    return paginate<AccountDoc, Account>(this.accModel, query, paginateQuery);
  }

  async listAccounts(filter: FilterQuery<AccountDoc>, limit: number = null): Promise<AccountDoc[]> {
    const res = this.accModel.find(filter, {}, { limit: limit });
    return res.exec();
  }

  async getAccount(filter: FilterQuery<AccountDoc>, projection?: ProjectionType<Account>): Promise<AccountDoc> {
    return this.accModel.findOne(filter, projection).exec();
  }

  async createAccount(account: Account): Promise<AccountDoc> {
    const hashPassword = await this.hashPassword(account.password);
    account.password = hashPassword;
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

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, 'salt', 69, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }
}
