import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from "src/common/base/entities/base.entity";
import { Question } from '../../question/entities/question.entity';

@Entity('answers')
export class Answer extends AbstractEntity {
    @ApiProperty({
        description: 'Answer unique identifier',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Answer content',
        example: 'This is the answer content'
    })
    @Column({ type: 'text' })
    name_vi: string;

    @ApiProperty({
        description: 'Answer content in English',
        example: 'This is the answer content in English'
    })
    @Column({ name: 'name_en', type: 'text' })
    name_en: string;

    @ApiProperty({
        description: 'Whether this answer is correct',
        example: true,
        default: false
    })
    @Column({ name: 'isCorrect', default: false })
    isCorrect: boolean;

    @ApiProperty({
        description: 'Question ID that this answer belongs to',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769'
    })
    @Column({ name: 'questionId' })
    questionId: string;

    @ApiProperty({
        description: 'Question that this answer belongs to',
        type: () => Question
    })
    @ManyToOne(() => Question, (question) => question.answers)
    @JoinColumn({ name: 'questionId' })
    question: Question;

    constructor(partial: Partial<Answer>) {
        super();
        Object.assign(this, partial);
    }
}
