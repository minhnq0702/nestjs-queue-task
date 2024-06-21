import { CreateAccountDto } from '@/dto';
import { AccountDoc } from '@/entities/account.entity';
import { LoggerService } from '@/logger/logger.service';
import { Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UsePipes(ValidationPipe)
export class AccountsController {
  constructor(
    private readonly logger: LoggerService,
    private readonly accSvc: AccountsService,
  ) {}

  @Get()
  async ctrlListAccount(@Query('limit') limit: number, @Query('sort') sort: string[]): Promise<AccountDoc[]> {
    // TODO: update sort query
    this.logger.debug(`List accounts with limit ${sort}`);
    return this.accSvc.listAccounts({}, limit);
  }

  @Post()
  async ctrlCreateAount(@Payload() payload: CreateAccountDto): Promise<AccountDoc> {
    return this.accSvc.createAccount(payload);
  }
}
