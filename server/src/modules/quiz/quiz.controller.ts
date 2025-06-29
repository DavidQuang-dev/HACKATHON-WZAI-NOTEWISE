import { Controller, Get, HttpStatus, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';
import { PaginatedResponseDto } from 'src/common/base/dto/paginated-response.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Public()
    @Get()
    @ApiOperation({
        summary: 'Get all quizzes',
        description: 'Retrieve a paginated list of all quizzes in the system'
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all quizzes',
        type: PaginatedResponseDto<Quiz>,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findAll(@Query() filterDto: BaseFilterDto): Promise<PaginatedResponseDto<Quiz>> {
        return this.quizService.findAll(filterDto, ['questions', 'questions.answers'], []);
    }

    @Public()
    @Get(':id')
    @ApiOperation({
        summary: 'Get quiz by ID',
        description: 'Retrieve a specific quiz by its unique identifier'
    })
    @ApiParam({ name: 'id', description: 'Quiz unique identifier', example: '3faf4ce9-a8a1-481f-bd7c-9b7d193444f7' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved quiz',
        type: Quiz,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Quiz not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findOne(@Param('id') id: string): Promise<Quiz> {
        const response = await this.quizService.findOne(id, ['questions', 'questions.answers']);
        if (!response) {
            throw new Error(`Quiz with ID ${id} not found`);
        }

        // Remove isCorrect from answers and sort questions by ordering
        response.questions = response.questions
            .sort((a, b) => a.ordering - b.ordering)
            .map(question => {
                question.answers = question.answers.map(answer => {
                    const { isCorrect, ...answerWithoutCorrect } = answer;
                    return answerWithoutCorrect as any;
                });
                return question;
            });

        return response;
    }
}