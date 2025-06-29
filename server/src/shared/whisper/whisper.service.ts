import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class WhisperService {
  private readonly logger = new Logger(WhisperService.name);
  private readonly openai: OpenAI;
  private readonly sttModel: string;

  constructor(private readonly configService: ConfigService) {    // Sử dụng ConfigService thay vì process.env trực tiếp
    this.openai = new OpenAI({ apiKey: this.configService.get<string>('openai.apiKey')});
    this.sttModel = this.configService.get<string>('openai.sttModel') || 'whisper-1';
  }

  async transcribeAudio(file: Express.Multer.File): Promise<string> {
    try {
      this.logger.log(`Transcribing file: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`);

      // Kiểm tra file tồn tại
      if (!file.path || !fs.existsSync(file.path)) {
        throw new Error(`File not found at path: ${file.path}`);
      }

      const fileStream = fs.createReadStream(file.path);

      const response = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: this.sttModel,
        language: 'vi', // Tiếng Việt - có thể config thành dynamic
        response_format: 'text',
      });

      if (!response || !response.trim()) {
        throw new Error('Transcription returned empty result');
      }

      this.logger.log(`Transcription completed successfully. Length: ${response.length} characters`);
      return response.trim();
    } catch (error) {
      this.logger.error('Error during audio transcription:', {
        message: error.message,
        fileName: file?.originalname,
        filePath: file?.path,
        fileSize: file?.size,
        stack: error.stack
      });
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    } finally {
      // Cleanup: Xóa file tạm sau khi xử lý
      if (file?.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
          this.logger.log(`Temporary file deleted: ${file.path}`);
        } catch (cleanupError) {
          this.logger.warn(`Failed to delete temporary file: ${cleanupError.message}`);
        }
      }
    }
  }
}
