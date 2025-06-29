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
      this.logger.log(`Transcribing audio file: ${file.filename}`);

      const fileStream = fs.createReadStream(file.path);

      const response = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: this.sttModel,
        });

      this.logger.log('Audio transcription completed successfully');
      return response.text;
    } catch (error) {
      this.logger.error('Error during audio transcription:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    } finally {
      // Cleanup: Xóa file tạm sau khi xử lý
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        this.logger.log(`Temporary file deleted: ${file.path}`);
      }
    }
  }
}
