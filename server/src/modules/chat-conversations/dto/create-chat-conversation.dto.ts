import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateChatConversationDto {
  @ApiProperty({
    description: 'Title of the chat conversation',
    example: 'Computer Science Program Inquiry',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Conversation title is required' })
  @IsString({ message: 'Conversation title must be a string' })
  @MinLength(1, { message: 'Conversation title cannot be empty' })
  @MaxLength(200, {
    message: 'Conversation title cannot exceed 200 characters',
  })
  conversationTitle: string;

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
