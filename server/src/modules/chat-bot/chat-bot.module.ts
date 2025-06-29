import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatController } from './chat-bot.controller';
import { ChatMessagesModule } from '../chat-messages/chat-messages.module';
import { ChatConversationsModule } from '../chat-conversations/chat-conversations.module';
import { GeminiModule } from 'src/shared/gemini';
import { AccountModule } from '../account/account.module';
import { TranscriptModule } from '../transcript/transcript.module';

@Module({
  imports: [
    ChatConversationsModule,
    ChatMessagesModule,
    GeminiModule,
    AccountModule,
    TranscriptModule
  ],
  controllers: [ChatController],
  providers: [ChatBotService],
  exports: [ChatBotService],
})
export class ChatBotModule {}
