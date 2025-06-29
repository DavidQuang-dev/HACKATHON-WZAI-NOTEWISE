import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { Transcript } from './entities/transcript.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TranscriptService extends BaseService<Transcript> {
  constructor(
    @InjectRepository(Transcript)
    private readonly transcriptRepository: Repository<Transcript>,
  ) {
    super(transcriptRepository);
  }
  
} 


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjQ0M2M4OS03ZmRmLTRjYmItOWQyOS01MTkzYzhmZjFmMzciLCJlbWFpbCI6InRyb25nbGhxZTE4MDE4NUBmcHQuZWR1LnZuIiwiaXNBY3RpdmUiOnRydWUsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MDE3NzYyOSwiZXhwIjoxNzUwMTgxMjI5fQ.emIVwrOpqo8OvbiN8QdB1fQFFdW0iHUK0alACR1RVPU
