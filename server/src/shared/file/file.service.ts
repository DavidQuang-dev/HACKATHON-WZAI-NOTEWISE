import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FILE_UPLOAD_CONFIG } from 'src/config/file-types.config';
import { v4 as uuidv4 } from 'uuid';
import { WhisperService } from '../whisper/whisper.service';
import { GeminiService } from '../gemini';
import { SummarizedTranscriptService } from 'src/modules/summarized-transcript/summarized-transcript.service';
import { TranscriptService } from 'src/modules/transcript/transcript.service';
import { QuizService } from 'src/modules/quiz/quiz.service';
import { HandleAudioFileResponse } from './dto/handle-audio-file-res.dto';

@Injectable()
export class FileService {
  constructor(private readonly whisperService: WhisperService, 
    private readonly geminiService: GeminiService, 
    private readonly summaryService: SummarizedTranscriptService,
    private readonly transcriptService: TranscriptService,
    private readonly quizService: QuizService
  ) { }

  private validateFile(file: Express.Multer.File): void {
    if (!file || !file.buffer) {
      throw new HttpException('No file uploaded or file is empty', 400);
    }
    const allowedMimeTypes = FILE_UPLOAD_CONFIG.getAllowedTypes();
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const allowedExtensions = Object.values(
        FILE_UPLOAD_CONFIG.getExtensionsMapping(),
      ).join(',');
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed formats: ${allowedExtensions}`,
      );
    }
    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds the limit of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`,
      );
    }
    if (file.originalname.length > FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH) {
      throw new BadRequestException(
        `File name is too long. Maximum length is ${FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH} characters.`,
      );
    }
  }

  private validateFiles(files: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded or files are empty', 400);
    }
    const allowedMimeTypes = FILE_UPLOAD_CONFIG.getAllowedTypes();
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const allowedExtensions = Object.values(
          FILE_UPLOAD_CONFIG.getExtensionsMapping(),
        ).join(',');
        throw new BadRequestException(
          `Invalid file type: ${file.mimetype}. Allowed formats: ${allowedExtensions}`,
        );
      }
      if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
        throw new BadRequestException(
          `File size exceeds the limit of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`,
        );
      }
      if (file.originalname.length > FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH) {
        throw new BadRequestException(
          `File name is too long. Maximum length is ${FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH} characters.`,
        );
      }
    }
  }

  async extractTranscribe(file: Express.Multer.File): Promise<HandleAudioFileResponse> {
    this.validateFile(file);
    
    const transcription = await this.whisperService.transcribeAudio(file);
    if (!transcription?.trim()) {
      throw new BadRequestException('Transcription failed or returned empty text.');
    }

    // Gọi song song 3 dịch vụ AI
    const [summary, fullTranscribeData, quizData] = await Promise.all([
      this.geminiService.generateSummary(transcription),
      this.geminiService.generateFullTranscribe(transcription),
      this.geminiService.generateQuiz(transcription),
    ]);

    if (!summary || !fullTranscribeData || !quizData) {
      throw new BadRequestException('AI generation failed.');
    }
  

    const [createdSummary, createdFullTranscription, createdQuiz] = await Promise.all([
      this.summaryService.create({
      name_vi: summary.name_vi,
      name_en: summary.name_en,
      description_vi: summary.description_vi,
      description_en: summary.description_en,
      }, []),
      this.transcriptService.create({
      name_vi: fullTranscribeData.name_vi,
      name_en: fullTranscribeData.name_en,
      description_vi: fullTranscribeData.description_vi,
      description_en: fullTranscribeData.description_en,
      }, []),
      this.quizService.create({
      name_vi: quizData.name_vi,
      name_en: quizData.name_en,
      description_vi: quizData.description_vi,
      description_en: quizData.description_en,
      totalQuestion: quizData.totalQuestion,
      estimatedTime: quizData.estimatedTime,
      }, [])
    ]);

    const response: HandleAudioFileResponse = {
      summary: createdSummary,
      fullTranscription: createdFullTranscription,
      quiz: createdQuiz
    };

    return response;
  }
}
