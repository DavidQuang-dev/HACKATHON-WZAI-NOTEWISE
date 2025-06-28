import { Injectable } from '@nestjs/common';
import { CreateQuestionAuditDto } from './dto/create-question-audit.dto';
import { UpdateQuestionAuditDto } from './dto/update-question-audit.dto';

@Injectable()
export class QuestionAuditService {
  create(createQuestionAuditDto: CreateQuestionAuditDto) {
    return 'This action adds a new questionAudit';
  }

  findAll() {
    return `This action returns all questionAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionAudit`;
  }

  update(id: number, updateQuestionAuditDto: UpdateQuestionAuditDto) {
    return `This action updates a #${id} questionAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionAudit`;
  }
}
