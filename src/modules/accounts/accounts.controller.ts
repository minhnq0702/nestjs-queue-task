import { PaginateResponse as PagiResp, Pagination } from '@/common/paginate/paginate';
import { AccountDto, CreateAccountDto } from '@/dto';
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
import { plainToInstance } from 'class-transformer';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AccountsController {
  constructor(
    private readonly logger: LoggerService,
    private readonly accSvc: AccountsService,
  ) {}

  @Get()
  @Pagination()
  async ctrlListAccount(@Query('limit') limit: number, @Query('page') page: number): Promise<PagiResp<AccountDto>> {
    // TODO: update sort query
    return this.accSvc.pagination({}, { limit, page }).then(([data, count]) => {
      const _data = plainToInstance(
        AccountDto,
        data.map((_d) => _d.toObject()),
        { excludeExtraneousValues: true },
      );
      return {
        data: _data,
        count: _data.length,
        total: count,
      };
    });
  }

  @Post()
  async ctrlCreateAccount(@Body() payload: CreateAccountDto): Promise<AccountDto> {
    return this.accSvc.createAccount(payload).then((res) => {
      return plainToInstance(AccountDto, res.toObject());
    });
  }

  // ! Should protect this route only for admin
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ctrlDeleteAccount(@Param('id') id: string): Promise<void> {
    return this.accSvc.deleteAccountById(id);
  }
}
