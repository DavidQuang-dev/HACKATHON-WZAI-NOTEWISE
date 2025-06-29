import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateNoteDto {
    @ApiProperty({
        description: 'Tên ghi chú',
        example: 'Ghi chú về cuộc họp',
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_vi: string;

    @ApiProperty({
        description: 'Tên ghi chú bằng tiếng Anh',
        example: 'Meeting Note',
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_en: string;

    @ApiProperty({
        description: 'Mô tả ghi chú',
        example: 'Ghi chú về cuộc họp với khách hàng'
    })
    @IsString()
    @IsNotEmpty()
    description_vi: string;

    @ApiProperty({
        description: 'Mô tả ghi chú bằng tiếng Anh',
        example: 'Meeting note about the client meeting'
    })
    @IsString()
    @IsNotEmpty()
    description_en: string;

    @ApiProperty({
        description: 'ID của summarized transcript',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
        required: false
    })
    @IsUUID()
    @IsOptional()
    summarizedTranscriptId?: string;

    @ApiProperty({
        description: 'ID của account tạo ghi chú',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769'
    })
    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @ApiProperty({
        description: 'ID của transcript',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
        required: false
    })
    @IsUUID()
    @IsOptional()
    transcriptId?: string;

    @ApiProperty({
        description: 'ID của question',
        example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
        required: false
    })
    @IsUUID()
    @IsOptional()
    questionId?: string;
}