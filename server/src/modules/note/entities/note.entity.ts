import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { AbstractEntity } from "src/common/base/entities/base.entity";
import { SummarizedTranscript } from "../../summarized-transcript/entities/summarized-transcript.entity";
import { Transcript } from "../../transcript/entities/transcript.entity";
import { Account } from "src/modules/account/entities/account.entity";
import { Quiz } from "../../quiz/entities/quiz.entity";

@Entity('note')
export class Note extends AbstractEntity {
    @ApiProperty({
        description: 'Unique identifier for the note',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // SummarizedNote	Full Transcript
    @ApiProperty({
        description: 'Tên ghi chú',
        example: 'Ghi chú về cuộc họp',
    })
    @Column({ type: 'varchar', length: 255 })
    name_vi: string;

    @ApiProperty({
        description: 'Tên ghi chú bằng tiếng Anh',
        example: 'Meeting Note',
    })
    @Column({ type: 'varchar', length: 255 })
    name_en: string;

    @ApiProperty({
        description: 'Mô tả ghi chú',
        example: 'Ghi chú về cuộc họp với khách hàng',
    })
    @Column({ type: 'text' })
    description_vi: string;

    @ApiProperty({
        description: 'Mô tả ghi chú bằng tiếng Anh',
        example: 'Meeting note about the client meeting',
    })
    @Column({ type: 'text' })
    description_en: string;

    // Relationships
    @ApiProperty({
        description: 'Summarized transcript associated with this note',
        type: () => SummarizedTranscript
    })
    @OneToOne(() => SummarizedTranscript)
    @JoinColumn({ name: 'summarizedTranscriptId' })
    summarizedTranscript: SummarizedTranscript;

    @ApiProperty({
        description: 'Account who created this note',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
        type: () => Account
    })
    @OneToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    account: Account;

    @ApiProperty({
        description: 'Transcript associated with this note',
        type: () => Transcript
    })
    @OneToOne(() => Transcript)
    @JoinColumn({ name: 'transcriptId' })
    transcript: Transcript;

    @ApiProperty({
        description: 'Quiz associated with this note',
        type: () => Quiz
    })
    @OneToOne(() => Quiz)
    @JoinColumn({ name: 'quizId' })
    quiz: Quiz;

    constructor(partial: Partial<Note>) {
        super();
        Object.assign(this, partial);
    }
}