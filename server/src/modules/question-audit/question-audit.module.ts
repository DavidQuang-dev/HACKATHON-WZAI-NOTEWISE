import { Module } from '@nestjs/common';
import { QuestionAuditService } from './question-audit.service';
import { QuestionAuditController } from './question-audit.controller';

@Module({
  controllers: [QuestionAuditController],
  providers: [QuestionAuditService],
})
export class QuestionAuditModule {}
