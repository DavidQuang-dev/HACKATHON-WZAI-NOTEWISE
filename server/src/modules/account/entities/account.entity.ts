import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/base/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Note } from 'src/modules/note/entities/note.entity';

@Entity('account')
export class Account extends AbstractEntity {
    @ApiProperty({
        description: 'User unique identifier',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        format: 'email',
        maxLength: 255
    })
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
        maxLength: 255
    })
    @Column({ type: 'varchar', length: 255 })
    fullName: string;

    @ApiProperty({
        description: 'User date of birth',
        example: '1990-05-15',
        type: 'string',
        format: 'date',
        required: false,
        nullable: true
    })
    @Column({ nullable: true, type: 'date' })
    birthday?: Date;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false,
        nullable: true
    })
    @Column({ nullable: true })
    phone?: string;

    @ApiProperty({
        description: 'User profile picture URL',
        example: 'https://example.com/avatar.jpg',
        format: 'url',
        required: false,
        nullable: true
    })
    @Column({ nullable: true })
    profilePicture?: string;

    @ApiProperty({
        description: 'List of notes created by the user',
        type: () => Note,
        isArray: true
    })
    @OneToMany(() => Note, (note) => note.account)
    notes: Note[];

    constructor(partial: Partial<Account>) {
        super();
        Object.assign(this, partial);
    }
}
