import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { CreateChatDto } from './dto/create-chat.dto';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatBotService) {}
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: false }))
  @ApiOperation({ summary: 'Create chat conversation with authentication' })
  @ApiBody({
    type: CreateChatDto,
    description: 'Chat question data (userId will be extracted from JWT token)',
    examples: {
      example1: {
        summary: 'Authenticated chat request',
        value: {
          question: 'Nói lại cho tao hiểu đi',
          conversationID: '685b84198537c0194fac2068',
          noteId: '52629604-c938-4a6b-a7f5-acc437b408e9',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token không hợp lệ',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createWithAuth(@Body() createChatDto: CreateChatDto, @Request() req) {
    try {
      // Lấy user từ JWT token (được set bởi GlobalAuthGuard)
      const user = req.user;
      const userId = user.id;

      console.log('🔐 Authenticated user:', user);
      console.log('👤 User ID from JWT token:', userId);
      console.log('📝 Received request:', createChatDto);

      // Override userId từ token thay vì từ body
      const chatData = {
        ...createChatDto,
        userId: userId, // Sử dụng userId từ JWT token
      };

      const result = await this.chatService.handleQuestion(chatData);

      console.log('✅ Service result:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('❌ Controller error:', error);
      console.error('📊 Error stack:', error.stack);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to process question',
          error: error.name || 'UnknownError',
          details: error.stack?.split('\n').slice(0, 3),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get(':noteId')
  @ApiOperation({
    summary: 'Get all messages in a conversation (authenticated)',
  })
  @ApiParam({
    name: 'noteId',
    required: true,
    description: 'ID of the conversation',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async findAllMessageInConversation(
    @Param('noteId') noteId: string,
  ) {
    try {
      const messages =
        await this.chatService.findAllMessageInConversation(noteId);
      return messages;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get messages',
          error: error.name || 'UnknownError',
          details: error.stack?.split('\n').slice(0, 3),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
