import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateQuizDto {
    @ApiProperty({
        description: 'Quiz name in Vietnamese',
        example: 'Kiến thức cơ bản JavaScript',
        maxLength: 255
    })
    @IsString()
    @MaxLength(255)
    name_vi: string;

    @ApiProperty({
        description: 'Quiz name in English',
        example: 'JavaScript Fundamentals',
        maxLength: 255
    })
    @IsString()
    @MaxLength(255)
    name_en: string;

    @ApiProperty({
        description: 'Quiz description in Vietnamese',
        example: 'Một bài kiểm tra toàn diện về kiến thức cơ bản JavaScript',
        required: false
    })
    @IsOptional()
    @IsString()
    description_vi?: string;

    @ApiProperty({
        description: 'Quiz description in English',
        example: 'A comprehensive quiz covering JavaScript basics',
        required: false
    })
    @IsOptional()
    @IsString()
    description_en?: string;

    @ApiProperty({
        description: 'Total number of questions in the quiz',
        example: 20,
        minimum: 0
    })
    @IsInt()
    @Min(0)
    totalQuestion: number;

    @ApiProperty({
        description: 'Estimated time to complete the quiz in minutes',
        example: 30,
        minimum: 0
    })
    @IsInt()
    @Min(0)
    estimatedTime: number;
}