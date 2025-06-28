import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizAuditService } from './quiz-audit.service';
import { CreateQuizAuditDto } from './dto/create-quiz-audit.dto';
import { UpdateQuizAuditDto } from './dto/update-quiz-audit.dto';

@Controller('quiz-audit')
export class QuizAuditController {
  constructor(private readonly quizAuditService: QuizAuditService) {}

  @Post()
  create(@Body() createQuizAuditDto: CreateQuizAuditDto) {
    return this.quizAuditService.create(createQuizAuditDto);
  }

  @Get()
  findAll() {
    return this.quizAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizAuditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizAuditDto: UpdateQuizAuditDto) {
    return this.quizAuditService.update(+id, updateQuizAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizAuditService.remove(+id);
  }
}
