import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from 'src/common/base/base.service';
import { Note } from './entities/note.entity';
import { SummarizedTranscriptService } from '../summarized-transcript/summarized-transcript.service';
import { AccountService } from '../account/account.service';
import { TranscriptService } from '../transcript/transcript.service';
import { QuestionService } from '../question/question.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class NoteService extends BaseService<Note> {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly summarizedTranscriptService: SummarizedTranscriptService,
    private readonly transcriptService: TranscriptService,
    private readonly accountService: AccountService,
    private readonly questionService: QuestionService,
  ) {
    super(noteRepository, {
      summarizedTranscript: summarizedTranscriptService,
      transcript: transcriptService,
      account: accountService,
      question: questionService,
    });
  }


  /**
   * Shares a note with another user by email.
   * @param email - The email of the user to share the note with.
   * @param noteId - The ID of the note to be shared.
   * @returns A success message if the note is shared successfully.
   */
  async shared(email: string, noteId: string): Promise<{ success: boolean; message: string }> {
    // Find the account by email
    const account = await this.accountService.findOneByOptions({
      where: { email },
      select: ['id'],
    });
    if (!account) {
      throw new Error(`Account with email ${email} not found`);
    }

    // Find the note by ID with relations
    const existingNote = await this.findOneByOptions({
      where: { id: noteId, account: { id: account.id } },
    });

    if (existingNote) {
      throw new BadRequestException(`Note with ID ${noteId} already exists for this account`);
    }

    let originalNote = await this.noteRepository.findOne({
      where: { id: noteId },
    });

    if (!originalNote) {
      throw new BadRequestException(`Note with ID ${noteId} not found`);
    }

    const { id, ...noteData } = originalNote;
    const newNote = { ...noteData, account };

    await this.noteRepository.save(newNote);
    return { success: true, message: 'Note shared successfully' };
  }

  protected getSearchableFields(): string[] {
    return [
      'name_vi',
      'name_en',
      'description_vi',
      'description_en',
    ];
  }
}
