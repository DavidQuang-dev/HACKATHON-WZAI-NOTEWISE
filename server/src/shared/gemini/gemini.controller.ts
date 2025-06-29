import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
  ValidationPipe,
  UsePipes,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { GeminiService } from './gemini.service';
import {
  ChunkingRequestDto,
  ChunkingResponseDto,
  QuickChunkRequestDto,
  QuickChunkResponseDto,
} from './dto/chunking.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@ApiTags('Gemini AI')
@Controller('api/v1/gemini')
@UseInterceptors(TransformInterceptor)
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }

  @Post('text/chunks')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Chunk text using Gemini AI',
    description:
      'Intelligently divide text into logical chunks optimized for embedding processing',
  })
  @ApiBody({
    type: ChunkingRequestDto,
    description: 'Text chunking request payload',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Text successfully chunked',
    type: ChunkingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request parameters',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error during text processing',
  })
  async chunkText(
    @Body() request: ChunkingRequestDto,
  ): Promise<ChunkingResponseDto> {
    try {
      if (!request.text?.trim()) {
        throw new BadRequestException(
          'Text content is required and cannot be empty',
        );
      }

      return await this.geminiService.chunkText(request);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to process text chunking',
        error.message,
      );
    }
  }

  @Post('text/chunks/quick')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Quick text chunking',
    description: 'Perform quick text chunking with minimal configuration',
  })
  @ApiBody({
    type: QuickChunkRequestDto,
    description: 'Quick chunking request payload',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Text successfully chunked',
    type: QuickChunkResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request parameters',
  })
  async quickChunk(
    @Body() request: QuickChunkRequestDto,
  ): Promise<QuickChunkResponseDto> {
    try {
      if (!request.text?.trim()) {
        throw new BadRequestException(
          'Text content is required and cannot be empty',
        );
      }

      const chunks = await this.geminiService.quickChunk(
        request.text,
        request.maxTokens || 1024,
      );

      return {
        success: true,
        chunks,
        totalChunks: chunks.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to perform quick chunking',
        error.message,
      );
    }
  }

  @Get('text/analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze text properties',
    description:
      'Get text analysis information like character count, estimated tokens, and language detection',
  })
  @ApiQuery({
    name: 'text',
    description: 'Text to analyze',
    required: true,
    type: String,
    example: 'This is a sample text for analysis.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Text analysis completed',
    schema: {
      type: 'object',
      properties: {
        characterCount: { type: 'number', example: 100 },
        wordCount: { type: 'number', example: 20 },
        estimatedTokens: { type: 'number', example: 25 },
        detectedLanguage: { type: 'string', example: 'en' },
        recommendedChunks: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid text parameter',
  })
  async analyzeText(@Query('text') text: string): Promise<{
    characterCount: number;
    wordCount: number;
    estimatedTokens: number;
    detectedLanguage: string;
    recommendedChunks: number;
  }> {
    if (!text?.trim()) {
      throw new BadRequestException(
        'Text parameter is required and cannot be empty',
      );
    }

    const characterCount = text.length;
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedTokens = Math.ceil(characterCount / 4); // Rough estimation
    const detectedLanguage = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(
      text.toLowerCase(),
    )
      ? 'vi'
      : 'en';
    const recommendedChunks = Math.ceil(estimatedTokens / 1024);

    return {
      characterCount,
      wordCount,
      estimatedTokens,
      detectedLanguage,
      recommendedChunks,
    };
  }
  }