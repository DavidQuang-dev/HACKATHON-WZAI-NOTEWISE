import { Module } from '@nestjs/common';
import { SummarizedTranscriptService } from './summarized-transcript.service';
import { SummarizedTranscript } from './entities/summarized-transcript.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { SummarizedTranscriptController } from './summarized-transcript.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SummarizedTranscript])],
  controllers: [SummarizedTranscriptController],
  providers: [SummarizedTranscriptService],
  exports: [SummarizedTranscriptService],
})
export class SummarizedTranscriptModule { }
