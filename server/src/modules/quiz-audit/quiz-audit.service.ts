import { Injectable } from '@nestjs/common';
import { CreateQuizAuditDto } from './dto/create-quiz-audit.dto';
import { UpdateQuizAuditDto } from './dto/update-quiz-audit.dto';

@Injectable()
export class QuizAuditService {
  create(createQuizAuditDto: CreateQuizAuditDto) {
    return 'This action adds a new quizAudit';
  }

  findAll() {
    return `This action returns all quizAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizAudit`;
  }

  update(id: number, updateQuizAuditDto: UpdateQuizAuditDto) {
    return `This action updates a #${id} quizAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizAudit`;
  }
}
