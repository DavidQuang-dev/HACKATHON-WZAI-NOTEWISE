import { Controller } from '@nestjs/common';
import { SummarizedTranscriptService } from './summarized-transcript.service';
import { BaseController } from 'src/common/base/base.controller';
import { SummarizedTranscript } from './entities/summarized-transcript.entity';
import { CreateSummarizedTranscriptDto } from './dto/summarized-transcript.dto';

@Controller('summarized-transcript')
export class SummarizedTranscriptController extends BaseController<SummarizedTranscript>({
    apiTags: 'Summarized Transcripts',
    entity: 'summarizedTranscript',
    dto: {
        create: CreateSummarizedTranscriptDto
    },
    relations: ['note'],
}) {
    constructor(
        private readonly summarizedTranscriptService: SummarizedTranscriptService,
    ) {
        super(summarizedTranscriptService);
    }
}