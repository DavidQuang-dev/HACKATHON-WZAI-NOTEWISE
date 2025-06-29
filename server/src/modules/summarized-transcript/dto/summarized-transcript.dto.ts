import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateSummarizedTranscriptDto {
    @ApiProperty({
        description: 'Tên tóm tắt',
        example: 'Tóm tắt cuộc họp',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_vi: string;

    @ApiProperty({
        description: 'Tên tóm tắt bằng tiếng Anh',
        example: 'Meeting summary',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_en: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt',
        example: 'Mô tả tóm tắt cuộc họp',
    })
    @IsString()
    @IsNotEmpty()
    description_vi: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt bằng tiếng Anh',
        example: 'Description of the meeting summary',
    })
    @IsString()
    @IsNotEmpty()
    description_en: string;
}

export class UpdateSummarizedTranscriptDto {
    @ApiProperty({
        description: 'Tên tóm tắt',
        example: 'Tóm tắt cuộc họp',
        maxLength: 255,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({
        description: 'Tên tóm tắt bằng tiếng Anh',
        example: 'Meeting summary',
        maxLength: 255,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name_en?: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt',
        example: 'Mô tả tóm tắt cuộc họp',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Mô tả tóm tắt bằng tiếng Anh',
        example: 'Description of the meeting summary',
        required: false,
    })
    @IsString()
    @IsOptional()
    description_en?: string;
}
