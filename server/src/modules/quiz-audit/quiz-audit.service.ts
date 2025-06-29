import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAudit } from './entities/quiz-audit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizAuditService extends BaseService<QuizAudit> {
  constructor(
    @InjectRepository(QuizAudit)
    private readonly quizAuditRepository: Repository<QuizAudit>,
  ) {
    super(quizAuditRepository);
  }

}
