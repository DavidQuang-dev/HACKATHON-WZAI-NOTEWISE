import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAudit } from './entities/quiz-audit.entity';
import { Repository, DeepPartial } from 'typeorm';
import { QuizService } from '../quiz/quiz.service';
import { CreateQuizAuditDto } from './dto/create-quiz-audit.dto';
import { QuestionAudit } from '../question-audit/entities/question-audit.entity';

@Injectable()
export class QuizAuditService extends BaseService<QuizAudit> {
  constructor(
    @InjectRepository(QuizAudit)
    private readonly quizAuditRepository: Repository<QuizAudit>,
    @InjectRepository(QuestionAudit)
    private readonly questionAuditRepository: Repository<QuestionAudit>,
    private readonly quizService: QuizService, // Assuming QuizService is injected to fetch quiz details
  ) {
    super(quizAuditRepository);
  }

  async createQuiz(createDto: DeepPartial<QuizAudit>, accountId?: string): Promise<{ questionAudits: QuestionAudit[], score: number }> {
    const dto = createDto as CreateQuizAuditDto;

    // 1. Lấy quiz và load luôn danh sách câu hỏi + đáp án
    const quiz = await this.quizService.findOneByOptions({
      where: { id: dto.quizId.toString() },
      relations: ['questions', 'questions.answers'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let score = 0;

    // 2. Tạo mới 1 QuizAudit entity

    if (!dto.questions || dto.questions.length === 0) {
      throw new Error('No questions provided for quiz audit');
    }

    const quizAudit = this.quizAuditRepository.create({
      quiz: quiz,
      account: { id: accountId },
      isDone: false,
    } as DeepPartial<QuizAudit>);

    // Lưu QuizAudit trước
    const savedQuizAudit = await this.quizAuditRepository.save(quizAudit);

    const questionAudits: QuestionAudit[] = [];

    // 2. Kiểm tra từng câu hỏi
    for (const { questionId, answerId } of dto.questions) {
      const question = quiz.questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error(`Question ${questionId} not found in quiz`);
      }

      const selectedAnswer = question.answers.find(a => a.id === answerId);
      if (!selectedAnswer) {
        throw new Error(`Answer ${answerId} not found for question ${questionId}`);
      }

      const isCorrect = selectedAnswer.isCorrect;
      if (isCorrect) score++;

      const questionAudit = this.questionAuditRepository.create({
        isCorrect: isCorrect,
        questionId: questionId,
        answerId: answerId,
        quizAuditId: savedQuizAudit.id,
      });

      questionAudits.push(questionAudit);
    }

    // 3. Lưu tất cả question audits
    await this.questionAuditRepository.save(questionAudits);

    // 4. Cập nhật isDone cho quizAudit
    savedQuizAudit.isDone = true;
    await this.quizAuditRepository.save(savedQuizAudit);


    // 5. Trả về quizAudit với questionAudits
    const result = await this.quizAuditRepository.findOne({
      where: { id: savedQuizAudit.id },
      relations: ['questionAudits', 'quiz', 'account'],
    });

    if (!result) {
      throw new Error('Failed to retrieve created quiz audit');
    }

    return { questionAudits: result.questionAudits, score: score };
  }

}
