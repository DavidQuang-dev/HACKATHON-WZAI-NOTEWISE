import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChunkingRequestDto {
    @ApiProperty({
        description: 'Text content to be chunked',
        example: 'Đây là một đoạn văn bản dài cần được chia thành các phần nhỏ hơn để xử lý...'
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        description: 'Maximum tokens per chunk',
        minimum: 256,
        maximum: 2048,
        default: 1024,
        example: 1024
    })
    @IsOptional()
    @IsNumber()
    @Min(256)
    @Max(2048)
    maxTokensPerChunk?: number = 1024;

    @ApiPropertyOptional({
        description: 'Language of the text content',
        enum: ['vi', 'en'],
        default: 'vi',
        example: 'vi'
    })
    @IsOptional()
    @IsString()
    language?: string = 'vi'; // 'vi' for Vietnamese, 'en' for English
}

export class QuickChunkRequestDto {
    @ApiProperty({
        description: 'Text content to be chunked',
        example: 'This is a sample text that needs to be chunked into smaller pieces.'
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        description: 'Maximum tokens per chunk',
        minimum: 256,
        maximum: 2048,
        default: 1024,
        example: 1024
    })
    @IsOptional()
    @IsNumber()
    @Min(256)
    @Max(2048)
    maxTokens?: number = 1024;
}

export class ChunkResponseDto {
    @ApiProperty({
        description: 'Title or summary of the chunk',
        example: 'Introduction to AI Technology'
    })
    title: string;

    @ApiProperty({
        description: 'Content of the chunk',
        example: 'Artificial Intelligence (AI) is a branch of computer science...'
    })
    content: string;

    @ApiPropertyOptional({
        description: 'Estimated token count for the chunk',
        example: 512
    })
    tokenCount?: number;
}

export class ChunkingResponseDto {
    @ApiProperty({
        description: 'Indicates if the operation was successful',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'Array of text chunks',
        type: [ChunkResponseDto]
    })
    chunks: ChunkResponseDto[];

    @ApiProperty({
        description: 'Total number of chunks created',
        example: 5
    })
    totalChunks: number;

    @ApiProperty({
        description: 'Length of the original text in characters',
        example: 5000
    })
    originalTextLength: number;

    @ApiPropertyOptional({
        description: 'Additional message or information',
        example: 'Text successfully chunked into 5 segments'
    })
    message?: string;
}

export class QuickChunkResponseDto {
    @ApiProperty({
        description: 'Indicates if the operation was successful',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'Array of text chunks',
        type: [ChunkResponseDto]
    })
    chunks: ChunkResponseDto[];

    @ApiProperty({
        description: 'Total number of chunks created',
        example: 3
    })
    totalChunks: number;
}
