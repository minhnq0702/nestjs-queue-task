import { Message, MessageSchema } from '@/entities/message.entity';
import { ExternalModule } from '@/external/external.module';
import { LoggerModule } from '@/logger/logger.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    LoggerModule.register('MESSAGES'),
    ExternalModule
  ],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
