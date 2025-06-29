import { Body, Controller, Post } from '@nestjs/common';
import { NoteService } from './note.service';
import { BaseController } from 'src/common/base/base.controller';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ShareNoteDto } from './dto/share.dto';

@Controller('note')
export class NoteController extends BaseController<Note>({
    apiTags: 'Notes',
    entity: 'note',
    dto: {
        create: CreateNoteDto,
    },
    relations: ['summarizedTranscript', 'quiz', 'transcript', 'account'],
    
}) {
    constructor(private readonly noteService: NoteService) {
        super(noteService);
    }

    @Public()
    @Post('shared')
    @ApiOperation({
        summary: 'Share note with user',
        description: 'Shares a note with the specified user by email address'
    })
    @ApiBody({ type: ShareNoteDto })
    @ApiResponse({
        status: 200,
        description: 'Note successfully shared with user',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Note shared successfully' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request data',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'string', example: 'Invalid email format or note ID' }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'User or note not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'User or note not found' }
            }
        }
    })
    async shared(@Body() shareNoteDto: ShareNoteDto): Promise<{ success: boolean; message: string }> {
        return this.noteService.shared(shareNoteDto.email, shareNoteDto.noteId);
    }
}
