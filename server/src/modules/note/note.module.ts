import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { SummarizedTranscriptModule } from '../summarized-transcript/summarized-transcript.module';
import { TranscriptModule } from '../transcript/transcript.module';
import { AccountModule } from '../account/account.module';
import { QuestionModule } from '../question/question.module';
@Module({
  imports: [TypeOrmModule.forFeature([Note]), SummarizedTranscriptModule, TranscriptModule, AccountModule, QuestionModule],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule { }
