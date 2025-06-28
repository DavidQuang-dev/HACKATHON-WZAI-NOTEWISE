import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../account/entities/account.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { AbstractEntity } from 'src/common/base/entities/base.entity';
import { QuestionAudit } from '../../question-audit/entities/question-audit.entity';

@Entity('quizAudit')
export class QuizAudit extends AbstractEntity {
    @ApiProperty({
        description: 'Unique identifier for the quiz audit',
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Whether the quiz is completed',
        example: true
    })
    @Column({ type: 'boolean', default: false })
    isDone: boolean;

    @ApiProperty({
        description: 'Account entity relationship'
    })
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: 'accountId' })
    account: Account;

    @ApiProperty({
        description: 'Quiz entity relationship'
    })
    @ManyToOne(() => Quiz, { eager: true })
    @JoinColumn({ name: 'quizId' })
    quiz: Quiz;

    @ApiProperty({
        description: 'Question audits belonging to this quiz audit',
        type: () => [QuestionAudit]
    })
    @OneToMany(() => QuestionAudit, (questionAudit) => questionAudit.quizAudit)
    questionAudits: QuestionAudit[];

    constructor(partial: Partial<QuizAudit>) {
        super();
        Object.assign(this, partial);
    }
}
