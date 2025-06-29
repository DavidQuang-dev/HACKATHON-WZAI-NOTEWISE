import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [GeminiController],
  providers: [GeminiService, ConfigService],
  exports: [GeminiService],
})
export class GeminiModule { }
