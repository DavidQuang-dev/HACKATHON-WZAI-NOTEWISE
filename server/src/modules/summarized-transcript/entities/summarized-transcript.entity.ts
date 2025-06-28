import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { AbstractEntity } from "src/common/base/entities/base.entity";
import { Note } from "../../note/entities/note.entity";

@Entity('summarized_transcript')
export class SummarizedTranscript extends AbstractEntity {
    @ApiProperty({
        description: 'Unique identifier for the summarized transcript',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Tên tóm tắt',
        example: 'Tóm tắt cuộc họp',
        required: true,
    })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        description: 'Tên tóm tắt bằng tiếng Anh',
        example: 'Meeting summary',
        required: true,
    })
    @Column({ type: 'varchar', length: 255 })
    name_en: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt',
        example: 'Mô tả tóm tắt cuộc họp',
        required: true,
    })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt bằng tiếng Anh',
        example: 'Description of the meeting summary',
        required: true,
    })
    @Column({ type: 'text' })
    description_en: string;

    @ApiProperty({
        description: 'Note that uses this summarized transcript',
        type: () => Note,
        required: false
    })
    @OneToOne(() => Note, (note) => note.summarizedTranscript)
    note?: Note;

    constructor(partial: Partial<SummarizedTranscript>) {
        super();
        Object.assign(this, partial);
    }
}
