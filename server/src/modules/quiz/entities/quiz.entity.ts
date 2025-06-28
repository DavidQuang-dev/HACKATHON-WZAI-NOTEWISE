import { AbstractEntity } from "src/common/base/entities/base.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Question } from '../../question/entities/question.entity';

@Entity('quiz')
export class Quiz extends AbstractEntity {
    @ApiProperty({
        description: 'Quiz unique identifier',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Quiz name',
        example: 'JavaScript Fundamentals'
    })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        description: 'Quiz name in English',
        example: 'JavaScript Fundamentals'
    })
    @Column({ type: 'varchar', length: 255 })
    name_en: string;

    @ApiProperty({
        description: 'Quiz description',
        example: 'A comprehensive quiz covering JavaScript basics'
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        description: 'Quiz description in English',
        example: 'A comprehensive quiz covering JavaScript basics'
    })
    @Column({ type: 'text', nullable: true })
    description_en: string;

    @ApiProperty({
        description: 'Total number of questions in the quiz',
        example: 20
    })
    @Column({ type: 'int', default: 0 })
    totalQuestion: number;

    @ApiProperty({
        description: 'Estimated time to complete the quiz in minutes',
        example: 30
    })
    @Column({ type: 'int', default: 0 })
    estimatedTime: number;

    @ApiProperty({
        description: 'Questions belonging to this quiz',
        type: () => [Question]
    })
    @OneToMany(() => Question, (question) => question.quiz)
    questions: Question[];

    constructor(partial: Partial<Quiz>) {
        super();
        Object.assign(this, partial);
    }
}
