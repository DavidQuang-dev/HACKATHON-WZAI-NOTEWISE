import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class QuizService extends BaseService<Quiz> {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {
    super(quizRepository);
  }
  
}
