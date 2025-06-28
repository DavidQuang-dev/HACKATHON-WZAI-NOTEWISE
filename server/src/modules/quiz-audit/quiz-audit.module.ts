import { Module } from '@nestjs/common';
import { QuizAuditService } from './quiz-audit.service';
import { QuizAuditController } from './quiz-audit.controller';

@Module({
  controllers: [QuizAuditController],
  providers: [QuizAuditService],
})
export class QuizAuditModule {}
