import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { WhisperModule } from '../whisper/whisper.module';
import { GeminiModule } from '../gemini';
import { QuizModule } from 'src/modules/quiz/quiz.module';
import { SummarizedTranscriptModule } from 'src/modules/summarized-transcript/summarized-transcript.module';
import { TranscriptModule } from 'src/modules/transcript/transcript.module';
import { FileController } from './file.controller';
import { QuestionModule } from 'src/modules/question/question.module';
import { AnswerModule } from 'src/modules/answer/answer.module';
import { NoteModule } from 'src/modules/note/note.module';

@Module({
  imports: [WhisperModule, GeminiModule, QuizModule, SummarizedTranscriptModule, TranscriptModule, QuestionModule, AnswerModule, NoteModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }
