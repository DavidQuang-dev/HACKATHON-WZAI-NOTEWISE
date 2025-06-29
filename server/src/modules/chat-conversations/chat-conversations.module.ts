import { Module } from '@nestjs/common';
import { ChatConversationsService } from './chat-conversations.service';
import { ChatConversation } from './entities/chat-conversation.schema';
import { ChatConversationsController } from './chat-conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChatConversation], 'mongodb')],
  controllers: [ChatConversationsController],
  providers: [ChatConversationsService],
  exports: [ChatConversationsService],
})
export class ChatConversationsModule {}
