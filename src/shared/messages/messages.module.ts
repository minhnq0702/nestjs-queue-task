import { Message, MessageSchema } from '@/entities/message.entity';
import { ExternalModule } from '@/external/external.module';
import { LoggerModule } from '@/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TWILIO_QUEUE_MSG_CHANNEL } from './constants';
import { MessageQueueProcessor } from './event/message.queue';
import { MessageCronService } from './event/messages.cron';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    LoggerModule.register('MESSAGES'),
    BullModule.registerQueue({
      name: TWILIO_QUEUE_MSG_CHANNEL
    }),
    ExternalModule
  ],
  providers: [MessagesService, MessageCronService, MessageQueueProcessor],
  controllers: [MessagesController]
})
export class MessagesModule {}
