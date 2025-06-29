import { Module } from '@nestjs/common';
import { TranscriptService } from './transcript.service';
import { Transcript } from './entities/transcript.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transcript])],
  providers: [TranscriptService],
  exports: [TranscriptService],
})
export class TranscriptModule { }
