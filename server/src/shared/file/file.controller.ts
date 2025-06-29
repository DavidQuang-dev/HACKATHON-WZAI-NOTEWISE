import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpStatus,
    HttpException,
    Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { HandleAudioFileResponse } from './dto/handle-audio-file-res.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('File Upload')
@Controller('file')
export class FileController {
    private readonly logger = new Logger(FileController.name);

    constructor(private readonly fileService: FileService) { }

    @Post('upload-audio')
    @Public(true)
    @ApiOperation({
        summary: 'Upload and process audio file',
        description: 'Upload an audio file to transcribe, summarize, and generate quiz'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Audio file (MP3, WAV, AAC) or Document file (PDF, DOC, DOCX, TXT)',
                },
            },
            required: ['file'],
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'File processed successfully',
        type: HandleAudioFileResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid file format or size',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Processing failed',
    })
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 25 * 1024 * 1024, // 25MB
        },
        fileFilter: (req, file, callback) => {
            // Basic validation - detailed validation in service
            const allowedMimeTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/aac',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
            }
        }
    }))
    async uploadAudioFile(
        @UploadedFile() file: Express.Multer.File
    ): Promise<{
        success: boolean;
        message: string;
        data?: HandleAudioFileResponse;
        statusCode: number;
    }> {
        try {
            this.logger.log(`Processing file: ${file?.originalname}`);

            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }

            const result = await this.fileService.extractTranscribe(file);

            this.logger.log(`File processed successfully: ${file.originalname}`);

            return {
                success: true,
                message: 'File processed successfully',
                data: result,
                statusCode: HttpStatus.OK
            };

        } catch (error) {
            this.logger.error(`File processing failed: ${error.message}`, error.stack);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Internal server error during file processing',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('upload-document')
    @Public(true)
    @ApiOperation({
        summary: 'Upload and process document file',
        description: 'Upload a document file (PDF, DOC, DOCX, TXT) to process'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Document file (PDF, DOC, DOCX, TXT)',
                },
            },
            required: ['file'],
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Document processed successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid file format or size',
    })
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 25 * 1024 * 1024, // 25MB
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new HttpException('Invalid document type', HttpStatus.BAD_REQUEST), false);
            }
        }
    }))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File
    ): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            this.logger.log(`Processing document: ${file?.originalname}`);

            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }

            // TODO: Implement document processing logic
            // const result = await this.fileService.processDocument(file);

            this.logger.log(`Document processed successfully: ${file.originalname}`);

            return {
                success: true,
                message: 'Document processed successfully',
                statusCode: HttpStatus.OK
            };

        } catch (error) {
            this.logger.error(`Document processing failed: ${error.message}`, error.stack);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Internal server error during document processing',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}