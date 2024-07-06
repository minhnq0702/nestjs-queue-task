import { PaginateResponse, Pagination } from '@/common/paginate/paginate';
import { MessageDto } from '@/dto/message.dto';
import { MsgNotFound } from '@/entities/error.entity';
import { MessageDoc } from '@/entities/message.entity';
import { LoggerService } from '@/logger/logger.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
@UsePipes(ValidationPipe)
export class MessagesController {
  constructor(
    private readonly logger: LoggerService,
    private readonly msgSvc: MessagesService,
  ) {}

  @Get()
  @Pagination()
  async ctrlListMsgs(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<PaginateResponse<MessageDoc>> {
    return this.msgSvc.pagiation({}, { limit, page }).then(([data, count]) => {
      return {
        data,
        count: data.length,
        total: count,
      };
    });
  }

  @Post()
  async ctrlCreateMessage(@Body() payload: MessageDto | MessageDto[]): Promise<MessageDoc[]> {
    if (Array.isArray(payload)) {
      return Promise.all(payload.map((item) => this.msgSvc.createMsg(item)));
    } else {
      return this.msgSvc.createMsg(payload).then((res) => [res]);
    }

    // return this.msgSvc.createMsg({
    //   ...payload
    // });
  }

  @Get(':id')
  async ctrlGetMessagekById(@Param('id') id: string): Promise<MessageDoc> {
    const msg = await this.msgSvc.getMsg({ id: id });
    if (!msg) {
      throw new MsgNotFound(`Message with id ${id.toString()} not found`);
    }
    return msg;
  }

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  async ctrlSendMessagekById(@Param('id') id: string): Promise<MessageDoc> {
    return this.msgSvc.sendMsgDirectly(id);
  }
}
