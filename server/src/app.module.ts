import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
                synchronize: true,
                logging: configService.get('db.logging') || false,
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),

        AccountModule,
        NoteModule,
        SummarizedTranscriptModule,
        TranscriptModule,
        QuizModule,
        QuestionModule,
        AnswerModule,
        QuizAuditModule,
        QuestionAuditModule
    ],
})
export class AppModule { }
