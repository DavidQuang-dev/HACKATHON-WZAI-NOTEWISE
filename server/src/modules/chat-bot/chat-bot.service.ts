import { Injectable, Logger } from '@nestjs/common';
import { ChatMessagesService } from '../chat-messages/chat-messages.service';
import { ChatMessageSender } from 'src/common/enums/chat-message-sender.enum';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatConversationsService } from '../chat-conversations/chat-conversations.service';
import { GeminiService } from 'src/shared/gemini';
import {
  ChatbotResponse,
  ChatConversationResponse,
  ChatMessageResponse,
  SearchResponseConversationDto,
} from './dto/search-response-conversation.dto';
import { AccountService } from '../account/account.service';
import { TranscriptService } from '../transcript/transcript.service';
import { Note } from '../note/entities/note.entity';

@Injectable()
export class ChatBotService {
  private readonly Logger = new Logger(ChatBotService.name);
  constructor(
    private readonly chatConversations: ChatConversationsService,
    private readonly chatMessages: ChatMessagesService,
    private readonly gemini: GeminiService,
    private readonly accountService: AccountService,
    private readonly transcriptService: TranscriptService
  ) { }

  async handleQuestion(createChatDto: CreateChatDto): Promise<ChatbotResponse> {
    const { question, noteId, userId, conversationId } = createChatDto;

    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }
    if (!question?.trim()) {
      throw new Error('Question cannot be empty');
    }
    if (!noteId?.trim()) {
      throw new Error('noteId cannot be empty');
    }

    try {
      await this.accountService.findOne(userId, []);
      let conversation;
      if (!conversationId) {
        const conversationTitle =
          await this.gemini.generateConversationTitle(question);
        conversation = await this.chatConversations.create({
          createdBy: userId,
          conversationTitle,
          noteId,
        });
      } else {
        conversation = await this.chatConversations.findOne(conversationId);
        if (!conversation) {
          // Tạo conversation mới nếu không tìm thấy
          this.Logger.warn(
            `Conversation ${conversationId} not found, creating new one`,
          );
          const conversationTitle =
            await this.gemini.generateConversationTitle(question);
          conversation = await this.chatConversations.create({
            createdBy: userId, 
            conversationTitle,
            noteId,
          });
        }
      }

      await this.chatMessages.create({
        content: question,
        sender: ChatMessageSender.USER,
        conversationId: conversation._id,
        createdBy: userId,
      });

      const conversationHistory = await this.findAllMessageInConversationByConversationId(
        conversation._id.toString(),
      );
      if (!conversationHistory) {
        throw new Error('Conversation history not found');
      }

      let transcribeRes: any;
      transcribeRes = await this.transcriptService.findOneByOptions({ where: { note: { id: noteId } } });
      if (!transcribeRes) {
        transcribeRes = {
          name_vi: 'không tìm thấy bản ghi âm',
          name_en: 'Transcribe not found',
          description_vi: 'Không tìm thấy bản ghi âm',
          description_en: 'Transcribe not found',
        }
      }

      const context = {
        transcribe: { description_vi: transcribeRes.description_vi, description_en: transcribeRes.description_en },
        conversationHistory: conversationHistory.messages,
      };
      this.Logger.log('Context for the question:', context);

      const prompt = await this.gemini.createGenerativePrompt(
        question,
        context,
      );
      this.Logger.log('Generated prompt:', prompt);

      const answer = await this.gemini.generateAnswer(prompt);
      this.Logger.log('Generated answer:', answer);

      await this.chatMessages.create({
        content: answer,
        sender: ChatMessageSender.AICHATBOT,
        conversationId: conversation._id,
        createdBy: userId,
      });
      const conversationResponse: ChatConversationResponse = {
        _id: conversation._id.toString(),
        conversationTitle: conversation.conversationTitle,
      };
      const response: ChatbotResponse = {
        answer,
        conversation: conversationResponse,
      };
      return response;
    } catch (error) {
      this.Logger.error('Error in handleQuestion:', error);
      throw new Error('An error occurred while processing the question');
    }
  }


  async findAllMessageInConversationByConversationId(
    conversationId: string,
  ): Promise<SearchResponseConversationDto> {
    try {
      const conversation = await this.chatConversations.findOne(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const messages = await this.chatMessages.findAll(conversation._id.toString());
      if (!messages) {
        this.Logger.warn(`No messages found in conversation ${conversation._id.toString()}`);
      }
      const messagesResponse: ChatMessageResponse[] = messages.map(
        (message: any) => ({
          _id: message._id.toString(),
          content: message.content,
          sender: message.sender,
          createdAt: message.metadata.createdAt.toISOString(),
        }),
      );
      const conversationResponse: SearchResponseConversationDto = {
        conversation: {
          _id: conversation._id.toString(),
          conversationTitle: conversation.conversationTitle,
        },
        messages: messagesResponse,
      };
      return conversationResponse;
    } catch (error) {
      this.Logger.error('Error fetching messages in conversation:', error);
      throw new Error('Failed to fetch messages in conversation');
    }
  }

    async findAllMessageInConversationByNoteId(
    noteId: string,
  ): Promise<SearchResponseConversationDto> {
    try {
      const conversation = await this.chatConversations.findOneByNoteId(noteId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const messages = await this.chatMessages.findAll(conversation._id.toString());
      if (!messages) {
        this.Logger.warn(`No messages found in conversation ${conversation._id.toString()}`);
      }
      const messagesResponse: ChatMessageResponse[] = messages.map(
        (message: any) => ({
          _id: message._id.toString(),
          content: message.content,
          sender: message.sender,
          createdAt: message.metadata.createdAt.toISOString(),
        }),
      );
      const conversationResponse: SearchResponseConversationDto = {
        conversation: {
          _id: conversation._id.toString(),
          conversationTitle: conversation.conversationTitle,
        },
        messages: messagesResponse,
      };
      return conversationResponse;
    } catch (error) {
      this.Logger.error('Error fetching messages in conversation:', error);
      throw new Error('Failed to fetch messages in conversation');
    }
  }
}
