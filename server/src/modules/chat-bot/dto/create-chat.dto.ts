import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'The question to ask the chatbot',
    example: 'What are the admission requirements for Computer Science?',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  question: string;

  @ApiProperty({
    description: 'Transcription of the audio file',
    example: 'The admission requirements for Computer Science include...',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  noteId: string;

  @ApiPropertyOptional({
    description:
      'User ID who is asking the question (will be extracted from JWT token)',
    example: 'user123',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  userId?: string;

  @ApiProperty({
    description: 'Optional conversation ID for the chat',
    example: 'conv123',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  conversationId?: string;
}
