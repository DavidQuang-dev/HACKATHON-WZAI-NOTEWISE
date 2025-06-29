import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/base/entities/base.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Note } from '../../note/entities/note.entity';

@Entity('question')
export class Question extends AbstractEntity {
    @ApiProperty({
        description: 'Unique identifier for the question',
        example: 1,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Question name in Vietnamese',
        example: 'Câu hỏi về TypeScript',
    })
    @Column({ type: 'varchar', length: 255 })
    name_vi: string;

    @ApiProperty({
        description: 'Question name in English',
        example: 'TypeScript Question',
    })
    @Column({ type: 'varchar', length: 255 })
    name_en: string;

    @ApiProperty({
        description: 'Detailed description of the question',
        example: 'This question tests your knowledge of TypeScript interfaces',
    })
    @Column({ type: 'text', nullable: true })
    description_vi: string;

    @ApiProperty({
        description: 'Detailed description of the question',
        example: 'This question tests your knowledge of TypeScript interfaces',
    })
    @Column({ type: 'text', nullable: true })
    description_en: string;

    @ApiProperty({
        description: 'Order position of the question',
        example: 1,
    })
    @Column({ type: 'int', default: 0 })
    ordering: number;

    @ApiProperty({
        description: 'Hint to help answer the question',
        example: 'Remember that interfaces define object structure',
    })
    @Column({ type: 'text', nullable: true })
    hint: string;

    @ApiProperty({
        description: 'Quiz that this question belongs to',
        type: () => Quiz
    })
    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @JoinColumn({ name: 'quizId' })
    quiz: Quiz;

    @ApiProperty({
        description: 'Answers belonging to this question',
        type: () => [Answer]
    })
    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    constructor(partial: Partial<Question>) {
        super();
        Object.assign(this, partial);
    }
}
