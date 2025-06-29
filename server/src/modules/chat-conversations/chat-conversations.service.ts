import { Injectable } from '@nestjs/common';
import { CreateChatConversationDto } from './dto/create-chat-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatConversation } from './entities/chat-conversation.schema';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChatConversationsService {
  constructor(
    @InjectRepository(ChatConversation, 'mongodb')
    private readonly chatConversationRepository: MongoRepository<ChatConversation>,
  ) {}
  async create(
    CreateDto: CreateChatConversationDto,
  ): Promise<ChatConversation> {
    const chatConversation = new ChatConversation({
      conversationTitle: CreateDto.conversationTitle,
      noteId: CreateDto.noteId,
      metadata: {
        createdAt: new Date(),
        createdBy: CreateDto.createdBy,
        updated: false,
        deleted: false,
      },
    });
    if (!chatConversation) {
      throw new Error('Failed to create chat conversation');
    }
    return await this.chatConversationRepository.save(chatConversation);
  }

  async findAll(userId: string): Promise<ChatConversation[]> {
    try {
      // Use MongoDB aggregation or find without complex nested where
      let conversations: ChatConversation[];
      if (userId) {
        conversations = await this.chatConversationRepository.find({
          where: { 'metadata.createdBy': userId },
          order: { 'metadata.createdAt': 'DESC' }, // Sort by createdAt if needed
        });
      } else {
        conversations = await this.chatConversationRepository.find();
      }

      console.log('Raw conversations from DB:', conversations.length); // Debug log

      // Filter in memory for now (since TypeORM MongoDB nested queries can be tricky)
      const filteredConversations = conversations.filter(
        (conv) => conv.metadata && conv.metadata.deleted === false,
      );

      console.log('Filtered conversations:', filteredConversations.length); // Debug log

      return filteredConversations;
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<ChatConversation> {
    const isValidObjectId = ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw new Error('Invalid ObjectId format');
    }

    const conversation = await this.chatConversationRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!conversation) {
      throw new Error('Chat conversation not found');
    }

    // Check if deleted
    if (conversation.metadata && conversation.metadata.deleted === true) {
      throw new Error('Chat conversation not found');
    }

    return conversation;
  }

  async findOneByNoteId(noteId: string): Promise<ChatConversation> {
    if (!noteId) {
      throw new Error('Note ID cannot be empty');
    }
    const conversation = await this.chatConversationRepository.findOne({
      where: { noteId: noteId },
    });
    if (!conversation) {
      throw new Error('Chat conversation not found');
    }
    // Check if deleted
    if (conversation.metadata && conversation.metadata.deleted === true) {
      throw new Error('Chat conversation not found');
    }
    return conversation;
  }

  async findTitle(title: string): Promise<ChatConversation> {
    if (!title) {
      throw new Error('Title cannot be empty');
    }
    const conversation = await this.chatConversationRepository.findOne({
      where: { conversationTitle: title },
    });

    if (!conversation) {
      throw new Error('Chat conversation not found');
    }

    // Check if deleted
    if (conversation.metadata && conversation.metadata.deleted === true) {
      throw new Error('Chat conversation not found');
    }

    return conversation;
  }

  async remove(id: string, userId: string): Promise<void> {
    const isValidObjectId = ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw new Error('Invalid ObjectId format');
    }
    const conversion = await this.findOne(id);
    if (!conversion) {
      throw new Error('Chat conversation not found');
    }
    conversion.metadata.deleted = true;
    conversion.metadata.deletedAt = new Date();
    const result = await this.chatConversationRepository.save(conversion);
    if (!result) {
      throw new Error('Failed to delete chat conversation');
    }
  }

  // Debug method để test connection
  async testConnection(): Promise<any> {
    try {
      console.log('Testing MongoDB connection...');
      const count = await this.chatConversationRepository.count();
      console.log('Total documents in collection:', count);

      const sample = await this.chatConversationRepository.find({ take: 1 });
      console.log('Sample document:', JSON.stringify(sample, null, 2));

      return { count, sample };
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      throw error;
    }
  }
}
