import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuizAuditDto {
    @ApiProperty({
        description: 'Account ID of the user taking the quiz',
        example: 1
    })
    @IsNumber()
    accountId: number;

    @ApiProperty({
        description: 'Quiz ID for the quiz audit',
        example: 1
    })
    @IsNumber()
    quizId: number;

    @ApiPropertyOptional({
        description: 'Whether the quiz is completed',
        example: false,
        default: false
    })
    @IsBoolean()
    @IsOptional()
    isDone?: boolean;
}