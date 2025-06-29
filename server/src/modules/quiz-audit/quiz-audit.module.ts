import { Module } from '@nestjs/common';
import { QuizAuditService } from './quiz-audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAudit } from './entities/quiz-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAudit])],
  providers: [QuizAuditService],
  exports: [QuizAuditService],
})
export class QuizAuditModule {}
