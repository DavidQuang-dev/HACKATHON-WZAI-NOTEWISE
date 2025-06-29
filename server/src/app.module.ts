import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AccountModule } from './modules/account/account.module';
import { NoteModule } from './modules/note/note.module';
import { SummarizedTranscriptModule } from './modules/summarized-transcript/summarized-transcript.module';
import { TranscriptModule } from './modules/transcript/transcript.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { QuizAuditModule } from './modules/quiz-audit/quiz-audit.module';
import { QuestionAuditModule } from './modules/question-audit/question-audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './shared/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhisperModule } from './shared/whisper/whisper.module';
import { FileModule } from './shared/file/file.module';
import { ChatBotModule } from './modules/chat-bot/chat-bot.module';
import { ChatConversationsModule } from './modules/chat-conversations/chat-conversations.module';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalAuthGuard } from './modules/auth/guards/global-auth.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('db.host'),
                port: configService.get('db.port'),
                username: configService.get('db.username'),
                password: configService.get('db.password'),
                database: configService.get('db.name'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('app.environment') === 'development',
                logging: configService.get('db.logging') || false,
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'mongodb',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                url: configService.get('mongodb.uri'),
                database: configService.get('mongodb.database'),
                entities: [__dirname + '/**/*.schema{.ts,.js}'],
                synchronize: true,
                autoLoadEntities: true,
                logging: true,
                logger: 'advanced-console',
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        AccountModule,
        NoteModule,
        SummarizedTranscriptModule,
        TranscriptModule,
        QuizModule,
        QuestionModule,
        AnswerModule,
        QuizAuditModule,
        QuestionAuditModule,
        JwtModule,
        WhisperModule,
        FileModule,
        ChatBotModule,
        ChatConversationsModule,
        ChatMessagesModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor
        },
        {
            provide: APP_GUARD,
            useClass: GlobalAuthGuard,
        },
    ],
})
export class AppModule { }
