import { Module } from '@nestjs/common';
import { SummarizedTranscriptService } from './summarized-transcript.service';
import { SummarizedTranscriptController } from './summarized-transcript.controller';

@Module({
  controllers: [SummarizedTranscriptController],
  providers: [SummarizedTranscriptService],
})
export class SummarizedTranscriptModule {}
