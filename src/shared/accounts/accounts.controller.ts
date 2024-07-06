import { PaginateResponse, Pagination } from '@/common/paginate/paginate';
import { CreateAccountDto } from '@/dto';
import { AccountDoc } from '@/entities/account.entity';
import { LoggerService } from '@/logger/logger.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UsePipes(ValidationPipe)
export class AccountsController {
  constructor(
    private readonly logger: LoggerService,
    private readonly accSvc: AccountsService,
  ) {}

  @Get()
  @Pagination()
  async ctrlListAccount(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<PaginateResponse<AccountDoc>> {
    // TODO: update sort query
    return this.accSvc.pagination({}, { limit, page }).then(([data, count]) => {
      return {
        data,
        count: data.length,
        total: count,
      };
    });
  }

  @Post()
  async ctrlCreateAccount(@Body() payload: CreateAccountDto): Promise<AccountDoc> {
    return this.accSvc.createAccount(payload);
  }

  // ! Should protect this route only for admin
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ctrlDeleteAccount(@Param('id') id: string): Promise<void> {
    return this.accSvc.deleteAccountById(id);
  }
}
