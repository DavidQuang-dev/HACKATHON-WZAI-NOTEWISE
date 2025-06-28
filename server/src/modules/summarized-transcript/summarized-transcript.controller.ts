import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummarizedTranscriptService } from './summarized-transcript.service';
import { CreateSummarizedTranscriptDto } from './dto/create-summarized-transcript.dto';
import { UpdateSummarizedTranscriptDto } from './dto/update-summarized-transcript.dto';

@Controller('summarized-transcript')
export class SummarizedTranscriptController {
  constructor(private readonly summarizedTranscriptService: SummarizedTranscriptService) {}

  @Post()
  create(@Body() createSummarizedTranscriptDto: CreateSummarizedTranscriptDto) {
    return this.summarizedTranscriptService.create(createSummarizedTranscriptDto);
  }

  @Get()
  findAll() {
    return this.summarizedTranscriptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.summarizedTranscriptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSummarizedTranscriptDto: UpdateSummarizedTranscriptDto) {
    return this.summarizedTranscriptService.update(+id, updateSummarizedTranscriptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.summarizedTranscriptService.remove(+id);
  }
}
