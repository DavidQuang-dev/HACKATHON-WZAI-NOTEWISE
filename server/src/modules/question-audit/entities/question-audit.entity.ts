import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { AbstractEntity } from 'src/common/base/entities/base.entity';
import { QuizAudit } from '../../quiz-audit/entities/quiz-audit.entity';

@Entity('questionAudit')
export class QuestionAudit extends AbstractEntity {
    @ApiProperty({
        description: 'Unique identifier for the question audit',
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Whether the answer is correct',
        example: true
    })
    @Column({ name: 'isCorrect', type: 'boolean' })
    isCorrect: boolean;

    // Relations
    @ManyToOne(() => Question)
    @JoinColumn({ name: 'questionId' })
    question: Question;

    @ManyToOne(() => QuizAudit, (quizAudit) => quizAudit.questionAudits)
    @JoinColumn({ name: 'quizAuditId' })
    quizAudit: QuizAudit;

    constructor(partial: Partial<QuestionAudit>) {
        super();
        Object.assign(this, partial);
    }
}
