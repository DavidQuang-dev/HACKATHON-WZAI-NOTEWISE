import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ChatMessageSender } from 'src/common/enums/chat-message-sender.enum';
import { ObjectId } from 'typeorm/driver/mongodb/bson.typings';

export class CreateChatMessageDto {
  @ApiProperty({
    description: 'The content of the chat message',
    example: 'Hello, can you help me with course information?',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Who sent the message',
    enum: ChatMessageSender,
    example: ChatMessageSender.USER,
  })
  @IsEnum(ChatMessageSender)
  sender: ChatMessageSender;

  @ApiProperty({
    description: 'ID of the chat session this message belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  conversationId: ObjectId;

  @ApiProperty({
    description: 'User ID who owns the conversation',
    example: 'user-123',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  @MaxLength(100, { message: 'User ID cannot exceed 100 characters' })
  createdBy: string;
}
