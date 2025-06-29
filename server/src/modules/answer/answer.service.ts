import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base/base.service';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService extends BaseService<Answer> {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {
    super(answerRepository);
  }
}
