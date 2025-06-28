import { PartialType } from '@nestjs/swagger';
import { CreateSummarizedTranscriptDto } from './create-summarized-transcript.dto';

export class UpdateSummarizedTranscriptDto extends PartialType(CreateSummarizedTranscriptDto) {}
