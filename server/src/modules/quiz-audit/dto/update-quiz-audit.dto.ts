import { PartialType } from '@nestjs/swagger';
import { CreateQuizAuditDto } from './create-quiz-audit.dto';

export class UpdateQuizAuditDto extends PartialType(CreateQuizAuditDto) { }