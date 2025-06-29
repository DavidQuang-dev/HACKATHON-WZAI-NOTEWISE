import { IsNumber, IsOptional, IsArray, ValidateNested, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class QuestionAnswerDto {
    @ApiProperty({
        description: 'Question ID',
        example: 'q123'
    })
    @IsString()
    questionId: string;

    @ApiProperty({
        description: 'Answer ID',
        example: 'a456'
    })
    @IsString()
    answerId: string;
}

export class CreateQuizAuditDto {
    @ApiProperty({
        description: 'Quiz ID for the quiz audit',
        example: '1'
    })
    @IsString()
    quizId: string;

    @ApiProperty({
        description: 'Array of questions and answers',
        type: [QuestionAnswerDto],
        example: [
            {
                questionId: 'q123',
                answerId: 'a456'
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questions: QuestionAnswerDto[];
}