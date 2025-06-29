import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { SummarizedTranscript } from 'src/modules/summarized-transcript/entities/summarized-transcript.entity';
import { Transcript } from 'src/modules/transcript/entities/transcript.entity';

export class HandleAudioFileResponse {
  noteId: string;
  summary: SummarizedTranscript;
  fullTranscription: Transcript;
  quiz: Quiz;
}
