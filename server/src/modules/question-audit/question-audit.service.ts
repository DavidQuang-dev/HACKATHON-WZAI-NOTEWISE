import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionAudit } from './entities/question-audit.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class QuestionAuditService extends BaseService<QuestionAudit> {
  constructor(
    @InjectRepository(QuestionAudit)
    private readonly questionAuditRepository: Repository<QuestionAudit>,
  ) {
    super(questionAuditRepository);
  }
}
