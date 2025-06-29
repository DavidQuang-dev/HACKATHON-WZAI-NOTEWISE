import { Module } from '@nestjs/common';
import { QuizAuditService } from './quiz-audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAudit } from './entities/quiz-audit.entity';
import { QuestionAudit } from '../question-audit/entities/question-audit.entity';
import { QuizModule } from '../quiz/quiz.module';
import { QuizAuditController } from './quiz-audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAudit, QuestionAudit]), QuizModule],
  controllers: [QuizAuditController],
  providers: [QuizAuditService],
  exports: [QuizAuditService],
})
export class QuizAuditModule { }
