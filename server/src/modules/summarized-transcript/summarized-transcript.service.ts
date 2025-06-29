import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { SummarizedTranscript } from './entities/summarized-transcript.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class SummarizedTranscriptService extends BaseService<SummarizedTranscript> {
  constructor(
    @InjectRepository(SummarizedTranscript)
    private readonly summarizedTranscriptRepository: Repository<SummarizedTranscript>,
  ) {
    super(summarizedTranscriptRepository);
  }
}
