import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { FILE_UPLOAD_CONFIG } from 'src/config/file-types.config';
import { v4 as uuidv4 } from 'uuid';
import { WhisperService } from '../whisper/whisper.service';
import { GeminiService } from '../gemini';
import { SummarizedTranscriptService } from 'src/modules/summarized-transcript/summarized-transcript.service';
import { TranscriptService } from 'src/modules/transcript/transcript.service';
import { QuizService } from 'src/modules/quiz/quiz.service';
import { HandleAudioFileResponse } from './dto/handle-audio-file-res.dto';
import { QuestionService } from 'src/modules/question/question.service';
import { AnswerService } from 'src/modules/answer/answer.service';
import { NoteService } from 'src/modules/note/note.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(private readonly whisperService: WhisperService,
    private readonly geminiService: GeminiService,
    private readonly summaryService: SummarizedTranscriptService,
    private readonly transcriptService: TranscriptService,
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly noteService: NoteService
  ) { }

  private validateFile(file: Express.Multer.File): void {
    this.logger.log(`Validating file: ${file?.originalname}, size: ${file?.size}, mimetype: ${file?.mimetype}`);

    if (!file) {
      this.logger.error('No file provided to validate');
      throw new HttpException('No file uploaded or file is empty', 400);
    }

    // For multer disk storage, check if file path exists instead of buffer
    if (!file.buffer && !file.path) {
      this.logger.error('File has no buffer or path - file may be corrupted');
      throw new HttpException('File is corrupted or empty', 400);
    }

    const allowedMimeTypes = FILE_UPLOAD_CONFIG.getAllowedTypes();
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const allowedExtensions = Object.values(
        FILE_UPLOAD_CONFIG.getExtensionsMapping(),
      ).join(', ');
      this.logger.error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedExtensions}`);
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed formats: ${allowedExtensions}`,
      );
    }

    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      this.logger.error(`File size ${file.size} exceeds limit ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE}`);
      throw new BadRequestException(
        `File size exceeds the limit of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`,
      );
    }

    if (file.originalname.length > FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH) {
      this.logger.error(`Filename too long: ${file.originalname.length} characters`);
      throw new BadRequestException(
        `File name is too long. Maximum length is ${FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH} characters.`,
      );
    }

    this.logger.log('File validation passed successfully');
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
    try {
      this.logger.log(`Starting extractTranscribe for file: ${file?.originalname}`);

      this.logger.log('Validating uploaded file...');
      this.validateFile(file);

      this.logger.log('Starting transcription using WhisperService...');
      const transcription = await this.whisperService.transcribeAudio(file);

      if (!transcription?.trim()) {
        this.logger.error('Transcription failed or returned empty text.');
        throw new BadRequestException('Transcription failed or returned empty text.');
      }
      this.logger.log(`Transcription completed successfully. Length: ${transcription.length} characters`);

      this.logger.log('Calling GeminiService for summary, full transcription, quiz generation, and note generation...');
      const [summary, fullTranscribeData, quizData, noteData] = await Promise.all([
        this.geminiService.generateSummary(transcription).catch(error => {
          this.logger.error('Summary generation failed:', error.message);
          throw new BadRequestException(`Summary generation failed: ${error.message}`);
        }),
        this.geminiService.generateFullTranscribe(transcription).catch(error => {
          this.logger.error('Full transcription generation failed:', error.message);
          throw new BadRequestException(`Full transcription generation failed: ${error.message}`);
        }),
        this.geminiService.generateQuiz(transcription).catch(error => {
          this.logger.error('Quiz generation failed:', error.message);
          throw new BadRequestException(`Quiz generation failed: ${error.message}`);
        }),
        this.geminiService.generateNote(transcription).catch(error => {
          this.logger.error('Note generation failed:', error.message);
          throw new BadRequestException(`Note generation failed: ${error.message}`);
        }),
      ]);

      if (!summary || !fullTranscribeData || !quizData || !noteData) {
        this.logger.error('AI generation failed - one or more results are null/undefined');
        throw new BadRequestException('AI generation failed.');
      }
      this.logger.log('AI generation completed successfully.');

      this.logger.log('Saving summary, full transcription, and quiz to the database...');
      const [createdSummary, createdFullTranscription, createdQuiz] = await Promise.all([
        this.summaryService.create({
          name_vi: summary.name_vi,
          name_en: summary.name_en,
          description_vi: summary.description_vi,
          description_en: summary.description_en,
        }, []).catch(error => {
          this.logger.error('Summary creation failed:', error.message);
          throw new BadRequestException(`Summary creation failed: ${error.message}`);
        }),
        this.transcriptService.create({
          name_vi: fullTranscribeData.name_vi,
          name_en: fullTranscribeData.name_en,
          description_vi: fullTranscribeData.description_vi,
          description_en: fullTranscribeData.description_en,
        }, []).catch(error => {
          this.logger.error('Transcript creation failed:', error.message);
          throw new BadRequestException(`Transcript creation failed: ${error.message}`);
        }),
        this.quizService.create({
          name_vi: quizData.name_vi,
          name_en: quizData.name_en,
          description_vi: quizData.description_vi,
          description_en: quizData.description_en,
          totalQuestion: quizData.totalQuestion,
          estimatedTime: quizData.estimatedTime,
        }, []).catch(error => {
          this.logger.error('Quiz creation failed:', error.message);
          throw new BadRequestException(`Quiz creation failed: ${error.message}`);
        })
      ]);

      const note = await this.noteService.create({
        name_vi: noteData.name_vi,
        name_en: noteData.name_en,
        description_vi: noteData.description_vi,
        description_en: noteData.description_en,
        summarizedTranscript: createdSummary,
        transcript: createdFullTranscription,
        quiz: createdQuiz,
      }, []).catch(error => {
        this.logger.error('Note creation failed:', error.message);
        throw new BadRequestException(`Note creation failed: ${error.message}`);
      });

      // add questions to quiz 
      const questionEntities = await Promise.all(
        (quizData.questions ?? []).map(async (q, idx) => {
          const question = await this.questionService.create({
            name_vi: q.name_vi,
            name_en: q.name_en,
            description_vi: q.description_vi,
            description_en: q.description_en,
            ordering: q.ordering || idx + 1,
            hint: q.hint,
            quiz: createdQuiz,
          }, []);

          const answerEntities = await Promise.all(
            q.answers.map((a) =>
              this.answerService.create({
                name_vi: a.content_vi,
                name_en: a.content_en,
                isCorrect: a.isCorrect,
                question: question,
              }, [])
            )
          );

          return { ...question, answers: answerEntities };
        })
      );

      const response: HandleAudioFileResponse = {
        summary: createdSummary,
        fullTranscription: createdFullTranscription,
        quiz: createdQuiz
      };

      this.logger.log('Returning response from extractTranscribe.');
      return response;

    } catch (error) {
      this.logger.error(`ExtractTranscribe failed:`, {
        message: error.message,
        stack: error.stack,
        fileName: file?.originalname
      });

      // Re-throw known exceptions
      if (error instanceof BadRequestException || error instanceof HttpException) {
        throw error;
      }

      // Wrap unknown errors
      throw new BadRequestException(`File processing failed: ${error.message}`);
    }
  }
}
