import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatConversationsService } from './chat-conversations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationResponseDto } from './dto/conversation-response.dto';

@ApiTags('Chat Conversations')
@Controller('chat-conversations')
@ApiBearerAuth()
export class ChatConversationsController {
  constructor(
    private readonly chatConversationsService: ChatConversationsService,
  ) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all conversations by userId' })
  async getAllConversationByUserId(@Param('userId') userId: string) {
    return this.chatConversationsService.findAll(userId);
  }

  // Hoặc: Lấy hội thoại của chính user đang đăng nhập (từ JWT)
  @Get('me')
  @ApiOperation({ summary: 'Get all conversations of the logged in user' })
  async getMyConversations(@Request() req) {
    const userId = req.user?.id;
    const conversations = await this.chatConversationsService.findAll(userId);

    // Lọc trùng theo id (giả sử id là duy nhất cho mỗi conversation)
    const uniqueConversationsMap = new Map<string, (typeof conversations)[0]>();
    conversations.forEach((conversation) => {
      uniqueConversationsMap.set(conversation._id.toString(), conversation);
    });

    const response: ConversationResponseDto[] = Array.from(
      uniqueConversationsMap.values(),
    ).map((conversation) => ({
      id: conversation._id.toString(),
      conversationTitle: conversation.conversationTitle,
      createdBy: conversation.metadata.createdBy,
      createdAt: conversation.metadata.createdAt.toISOString(),
    }));
    return response;
  }
}
