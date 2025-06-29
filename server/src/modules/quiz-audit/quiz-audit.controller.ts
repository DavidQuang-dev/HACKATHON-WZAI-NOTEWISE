import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { QuizAuditService } from './quiz-audit.service';
import { CreateQuizAuditDto } from './dto/create-quiz-audit.dto';
import { Request } from '@nestjs/common';

@ApiTags('Quiz Audit')
@ApiBearerAuth()
@Controller('quiz-audit')
export class QuizAuditController {
    constructor(private readonly quizAuditService: QuizAuditService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new quiz audit' })
    @ApiBody({ type: CreateQuizAuditDto })
    @ApiResponse({ status: 201, description: 'Quiz audit created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createQuizAuditDto: CreateQuizAuditDto, @Request() req) {
        const user = req.user;
        return this.quizAuditService.createQuiz(createQuizAuditDto as any, user.id);
    }
}