import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ChunkingRequestDto,
  ChunkingResponseDto,
  ChunkResponseDto,
} from './dto/chunking.dto';
import { ConfigService } from '@nestjs/config';
import {
  chunkingPrompt,
  fullTranscribePrompt,
  generateConversationTilePrompt,
  generativePrompt,
  quizPrompt,
  summaryPrompt,
} from './prompt.cofig';
import { ChatMessageResponse } from 'src/modules/chat-bot/dto/search-response-conversation.dto';

export interface Context {
  transcribe: {
    description_vi: string;
    description_en: string;
  };
  conversationHistory: ChatMessageResponse[];
}
export interface SummaryResponse {
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
}
export interface FullTranscribeResponse {
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
}
export interface QuizResponse {
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  totalQuestion: number,
  estimatedTime: number,
}

@Injectable()
export class GeminiService {
  private logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('gemini.apiKey') || 'your-default-api-key';
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async createGenerativePrompt(
    question: string,
    context: Context,
  ): Promise<string> {
    if (!question || question.trim().length === 0) {
      throw new BadRequestException('Question cannot be empty');
    }
    if (!context) {
      throw new BadRequestException(
        'Context must exist',
      );
    }
    const conversationHistory = context.conversationHistory
      .map((msg) => {
        return `${msg.sender === 'user' ? 'user' : 'bot'}: ${msg.content}`;
      })
      .join('\n\n');

    return generativePrompt(
      context.transcribe,
      conversationHistory,
      question,
    );
  }

  async generateAnswer(prompt: string): Promise<string> {
    if (!prompt || prompt.trim().length === 0) {
      throw new BadRequestException('Prompt cannot be empty');
    }
    try {
      const maxTokens = 1024; // or another appropriate default value
      const temperature = 0.7; // or another appropriate default value
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        },
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate answer', error);
      throw new BadRequestException('Failed to generate answer from Gemini');
    }
  }

  async generateConversationTitle(question: string): Promise<string> {
    if (!question || question.trim().length === 0) {
      throw new BadRequestException('Question cannot be empty');
    }
    const questionPrompted = generateConversationTilePrompt(question);
    try {
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: questionPrompted }] }],
        generationConfig: {
          maxOutputTokens: 50, // Adjust as needed
          temperature: 0.5, // Adjust as needed
        },
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate conversation title', error);
      throw new BadRequestException('Failed to generate conversation title');
    }
  }

  /**
   * Generates a summary of the transcription using Gemini AI
   * @param transcribe The transcription text to summarize
   * @returns A structured summary response
   */
  async generateSummary(transcribe: string): Promise<SummaryResponse> {
    if (!transcribe || transcribe.trim().length === 0) {
      throw new BadRequestException('Transcription cannot be empty');
    }
    const summaryTrancribe = summaryPrompt(transcribe);
    try {
      const maxTokens = 2048; // Adjust based on your needs
      const temperature = 0.5; // Adjust based on your needs
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: summaryTrancribe }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        },
      });

      const responseText = (await result.response).text(); 
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : responseText.trim();

      const summaryRes: SummaryResponse = JSON.parse(jsonContent);

      return summaryRes;
    } catch (error) {
      this.logger.error('Failed to generate full transcription', error);
      throw new BadRequestException('Failed to generate full transcription');
    }
  }

  async generateFullTranscribe(transcribe: string): Promise<FullTranscribeResponse> {
    if (!transcribe || transcribe.trim().length === 0) {
      throw new BadRequestException('Transcription cannot be empty');
    }
    const fullsTrancribe = fullTranscribePrompt(transcribe);
    try {
      const maxTokens = 2048; // Adjust based on your needs
      const temperature = 0.5; // Adjust based on your needs
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: fullsTrancribe }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        },
      });
      const response = await result.response;
      const responseText = (await result.response).text(); 
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : responseText.trim();

      const fullTranscribeRes: FullTranscribeResponse = JSON.parse(jsonContent);

      return fullTranscribeRes;
    } catch (error) {
      this.logger.error('Failed to generate full transcription', error);
      throw new BadRequestException('Failed to generate full transcription');
    }
  }

  async generateQuiz(transcribe: string): Promise<QuizResponse> {
    if (!transcribe || transcribe.trim().length === 0) {
      throw new BadRequestException('Transcription cannot be empty');
    }
    const quiz = quizPrompt(transcribe);
    try {
      const maxTokens = 2048; // Adjust based on your needs
      const temperature = 0.5; // Adjust based on your needs
      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: quiz }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        },
      });
      const responseText = (await result.response).text();
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      const response = JSON.parse(jsonContent);
      // chuyển đổi response thành object
      const quizResponse: QuizResponse = {
        name_vi: response.name_vi || response.name,
        name_en: response.name_en || response.name,
        description_vi: response.description_vi || response.description,
        description_en: response.description_en || response.description,
        totalQuestion: response.totalQuestion || 0,
        estimatedTime: response.estimatedTime || 30, 
      };
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate full transcription', error);
      throw new BadRequestException('Failed to generate full transcription');
    }
  }


  /**
   * Creates an optimized chunking prompt using prompt engineering best practices
   */
  private createChunkingPrompt(
    text: string,
    maxTokens: number,
    language: string,
  ): string {
    const languageInstructions =
      language === 'vi'
        ? {
          roleDescription:
            'Bạn là chuyên gia phân tích và tổ chức nội dung văn bản tiếng Việt.',
          taskDescription:
            'Phân tích và chia nhỏ văn bản thành các đoạn logic theo chủ đề',
          outputDescription:
            'đầu ra JSON không có thêm bất kỳ ký tự nào khác',
        }
        : {
          roleDescription:
            'You are an expert content analyst and text organizer.',
          taskDescription:
            'Analyze and divide text into logical topic-based chunks',
          outputDescription: 'JSON output without any additional characters',
        };

    return chunkingPrompt(
      languageInstructions.roleDescription,
      languageInstructions.taskDescription,
      text.length,
      maxTokens,
      language,
      text,
    );
  }

  /**
   * Estimates token count for text (rough approximation)
   */
  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for most languages
    // For Vietnamese: slightly higher ratio due to UTF-8 encoding
    return Math.ceil(text.length / 3.5);
  }

  /**
   * Validates and cleans JSON response from Gemini
   */
  private validateAndParseResponse(response: string): ChunkResponseDto[] {
    try {
      // Clean the response by removing any markdown formatting or extra text
      const cleanedResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const chunks = JSON.parse(cleanedResponse);

      if (!Array.isArray(chunks)) {
        throw new Error('Response is not an array');
      }

      // Validate each chunk
      const validatedChunks = chunks.map((chunk, index) => {
        if (!chunk.title || !chunk.content) {
          throw new Error(`Chunk ${index + 1} is missing title or content`);
        }

        return {
          title: chunk.title.trim(),
          content: chunk.content.trim(),
          tokenCount: this.estimateTokenCount(chunk.content),
        };
      });

      return validatedChunks;
    } catch (error) {
      this.logger.error('Failed to parse Gemini response', error);
      throw new BadRequestException('Invalid response format from AI model');
    }
  }

  /**
   * Chunks text using Gemini AI with intelligent topic-based segmentation
   */
  async chunkText(request: ChunkingRequestDto): Promise<ChunkingResponseDto> {
    try {
      this.logger.debug(
        `Starting text chunking for ${request.text.length} characters`,
      );

      const prompt = this.createChunkingPrompt(
        request.text,
        request.maxTokensPerChunk || 1024,
        request.language || 'vi',
      );

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      this.logger.debug('Received response from Gemini');

      const chunks = this.validateAndParseResponse(responseText); // Validate token limits
      const oversizedChunks = chunks.filter(
        (chunk) =>
          (chunk.tokenCount || 0) > (request.maxTokensPerChunk || 1024),
      );

      if (oversizedChunks.length > 0) {
        this.logger.warn(`${oversizedChunks.length} chunks exceed token limit`);
      }

      const result_response: ChunkingResponseDto = {
        success: true,
        chunks,
        totalChunks: chunks.length,
        originalTextLength: request.text.length,
        message: `Successfully chunked text into ${chunks.length} segments`,
      };

      this.logger.log(
        `Text chunking completed: ${chunks.length} chunks created`,
      );
      return result_response;
    } catch (error) {
      this.logger.error('Text chunking failed', error);

      return {
        success: false,
        chunks: [],
        totalChunks: 0,
        originalTextLength: request.text.length,
        message: `Chunking failed: ${error.message}`,
      };
    }
  }

  /**
   * Quick text chunking for simple use cases
   */
  async quickChunk(
    text: string,
    maxTokens: number = 1024,
  ): Promise<ChunkResponseDto[]> {
    const request: ChunkingRequestDto = {
      text,
      maxTokensPerChunk: maxTokens,
      language: 'vi',
    };

    const response = await this.chunkText(request);
    return response.chunks;
  }
}
