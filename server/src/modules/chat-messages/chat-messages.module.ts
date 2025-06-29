import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessage } from './entities/chat-message.schema';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage], 'mongodb')],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
