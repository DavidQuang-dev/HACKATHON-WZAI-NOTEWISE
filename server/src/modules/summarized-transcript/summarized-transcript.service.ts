import { Injectable } from '@nestjs/common';
import { CreateSummarizedTranscriptDto } from './dto/create-summarized-transcript.dto';
import { UpdateSummarizedTranscriptDto } from './dto/update-summarized-transcript.dto';

@Injectable()
export class SummarizedTranscriptService {
  create(createSummarizedTranscriptDto: CreateSummarizedTranscriptDto) {
    return 'This action adds a new summarizedTranscript';
  }

  findAll() {
    return `This action returns all summarizedTranscript`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summarizedTranscript`;
  }

  update(id: number, updateSummarizedTranscriptDto: UpdateSummarizedTranscriptDto) {
    return `This action updates a #${id} summarizedTranscript`;
  }

  remove(id: number) {
    return `This action removes a #${id} summarizedTranscript`;
  }
}
