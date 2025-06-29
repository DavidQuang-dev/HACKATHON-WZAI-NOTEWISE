import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateChatMessageDto } from './create-chat-message.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ChatMessageSender } from 'src/common/enums/chat-message-sender.enum';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {
  @ApiProperty({
    description: 'The content of the chat message',
    example: 'Updated message content',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Who sent the message',
    enum: ChatMessageSender,
    example: ChatMessageSender.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChatMessageSender)
  sender?: ChatMessageSender;
}
