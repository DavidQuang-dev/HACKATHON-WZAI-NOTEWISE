import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionAuditService } from './question-audit.service';
import { CreateQuestionAuditDto } from './dto/create-question-audit.dto';
import { UpdateQuestionAuditDto } from './dto/update-question-audit.dto';

@Controller('question-audit')
export class QuestionAuditController {
  constructor(private readonly questionAuditService: QuestionAuditService) {}

  @Post()
  create(@Body() createQuestionAuditDto: CreateQuestionAuditDto) {
    return this.questionAuditService.create(createQuestionAuditDto);
  }

  @Get()
  findAll() {
    return this.questionAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionAuditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionAuditDto: UpdateQuestionAuditDto) {
    return this.questionAuditService.update(+id, updateQuestionAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionAuditService.remove(+id);
  }
}
