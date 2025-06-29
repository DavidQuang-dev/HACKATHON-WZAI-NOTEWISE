import { Module } from '@nestjs/common';
import { QuestionAuditService } from './question-audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionAudit } from './entities/question-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionAudit])],
  providers: [QuestionAuditService],
  exports: [QuestionAuditService],
})
export class QuestionAuditModule { }
