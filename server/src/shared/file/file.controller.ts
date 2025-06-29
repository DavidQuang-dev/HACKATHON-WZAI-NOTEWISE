import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  HttpException,
  Logger,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FileService } from './file.service';
import { HandleAudioFileResponse } from './dto/handle-audio-file-res.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('File Upload')
@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private readonly fileService: FileService) {
    // Tạo thư mục uploads nếu chưa tồn tại
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      this.logger.log('Created uploads directory');
    }
  }

  @Post('process-text')
  @Public(true)
  @ApiOperation({
    summary: 'Process text content',
    description: 'Process text content to generate summary and quiz',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text content to process',
          example: 'Your text content here...',
        },
      },
      required: ['text'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Text processed successfully',
    type: HandleAudioFileResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid text content',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Processing failed',
  })
  async processText(@Body() body: { text: string }): Promise<{
    success: boolean;
    message: string;
    data?: HandleAudioFileResponse;
    statusCode: number;
  }> {
    try {
      this.logger.log('Processing text content...');

      if (!body.text || body.text.trim().length === 0) {
        this.logger.error('No text content provided');
        throw new HttpException(
          'Text content is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.text.length > 50000) {
        // 50KB text limit
        this.logger.error(`Text too long: ${body.text.length} characters`);
        throw new HttpException(
          'Text content exceeds maximum length limit',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log('Starting text processing...');
      const result = await this.fileService.processTextContent(body.text);

      this.logger.log('Text processed successfully');

      return {
        success: true,
        message: 'Text processed successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Text processing failed:`, {
        message: error.message,
        stack: error.stack,
        textLength: body?.text?.length,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Internal server error during text processing: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-audio')
  @Public(true)
  @ApiOperation({
    summary: 'Upload and process audio file',
    description:
      'Upload an audio file to transcribe, summarize, and generate quiz',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Audio file (MP3, WAV, AAC) or Document file (PDF, DOC, DOCX, TXT)',
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Tạo tên file unique để tránh conflict
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
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
          'audio/webm',
          'video/mp4',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
    }),
  )
  async uploadAudioFile(@UploadedFile() file: Express.Multer.File): Promise<{
    success: boolean;
    message: string;
    data?: HandleAudioFileResponse;
    statusCode: number;
  }> {
    try {
      this.logger.log(`Processing file: ${file?.originalname || 'unknown'}`);
      this.logger.log(
        `File details: size=${file?.size}, mimetype=${file?.mimetype}`,
      );

      if (!file) {
        this.logger.error('No file uploaded in request');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Validate file size
      if (file.size > 25 * 1024 * 1024) {
        this.logger.error(`File too large: ${file.size} bytes`);
        throw new HttpException(
          'File size exceeds 25MB limit',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate file type
      const allowedMimeTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/aac',
        'audio/webm',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        this.logger.error(`Invalid file type: ${file.mimetype}`);
        throw new HttpException(
          `Invalid file type: ${file.mimetype}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log('Starting file processing...');
      const result = await this.fileService.extractTranscribe(file);

      this.logger.log(`File processed successfully: ${file.originalname}`);

      return {
        success: true,
        message: 'File processed successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`File processing failed:`, {
        message: error.message,
        stack: error.stack,
        fileName: file?.originalname,
        fileSize: file?.size,
        fileMimeType: file?.mimetype,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      // More specific error handling
      if (error.message?.includes('ENOENT')) {
        throw new HttpException(
          'File not found or cannot be accessed',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error.message?.includes('timeout')) {
        throw new HttpException(
          'File processing timeout',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      if (error.message?.includes('size')) {
        throw new HttpException('File size error', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        `Internal server error during file processing: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-document')
  @Public(true)
  @ApiOperation({
    summary: 'Upload and process document file',
    description: 'Upload a document file (PDF, DOC, DOCX, TXT) to process',
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      limits: {
        fileSize: 25 * 1024 * 1024, // 25MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new HttpException('Invalid document type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    try {
      this.logger.log(
        `Processing document: ${file?.originalname || 'unknown'}`,
      );
      this.logger.log(
        `Document details: size=${file?.size}, mimetype=${file?.mimetype}`,
      );

      if (!file) {
        this.logger.error('No document uploaded in request');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Validate file size
      if (file.size > 25 * 1024 * 1024) {
        this.logger.error(`Document too large: ${file.size} bytes`);
        throw new HttpException(
          'File size exceeds 25MB limit',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate document type
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        this.logger.error(`Invalid document type: ${file.mimetype}`);
        throw new HttpException(
          `Invalid document type: ${file.mimetype}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // TODO: Implement document processing logic
      // const result = await this.fileService.processDocument(file);

      // Temporary response for testing
      this.logger.log(`Document processed successfully: ${file.originalname}`);

      return {
        success: true,
        message: 'Document processed successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Document processing failed:`, {
        message: error.message,
        stack: error.stack,
        fileName: file?.originalname,
        fileSize: file?.size,
        fileMimeType: file?.mimetype,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Internal server error during document processing: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
