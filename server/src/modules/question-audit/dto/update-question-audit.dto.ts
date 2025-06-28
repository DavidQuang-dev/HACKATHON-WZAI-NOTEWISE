import { PartialType } from '@nestjs/swagger';
import { CreateQuestionAuditDto } from './create-question-audit.dto';

export class UpdateQuestionAuditDto extends PartialType(CreateQuestionAuditDto) {}
