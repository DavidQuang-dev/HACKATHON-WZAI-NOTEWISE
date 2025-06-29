import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, SelectQueryBuilder } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessage } from './entities/chat-message.schema';

@Injectable()
export class ChatMessagesService {
  private readonly logger = new Logger(ChatMessagesService.name);
  constructor(
    @InjectRepository(ChatMessage, 'mongodb')
    private readonly chatMessageRepository: MongoRepository<ChatMessage>,
  ) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    try {
      // Convert conversationId to ObjectId if it's a string
      let conversationId = createChatMessageDto.conversationId;
      if (typeof conversationId === 'string') {
        if (!ObjectId.isValid(conversationId)) {
          throw new BadRequestException(
            `Invalid conversation ID format: ${conversationId}`,
          );
        }
        conversationId = new ObjectId(conversationId);
      }

      const chatMessage = new ChatMessage({
        content: createChatMessageDto.content,
        sender: createChatMessageDto.sender,
        conversationId: conversationId,
      });

      // Set metadata
      chatMessage.metadata = {
        createdAt: new Date(),
        createdBy: createChatMessageDto.createdBy,
        updated: false,
        deleted: false,
      };

      this.logger.log(
        'Creating chat message:',
        JSON.stringify(chatMessage, null, 2),
      );
      const savedMessage = await this.chatMessageRepository.save(chatMessage);
      this.logger.log('Chat message created successfully:', savedMessage._id);

      return savedMessage;
    } catch (error) {
      this.logger.error('Error creating chat message', error);
      throw new BadRequestException('Failed to create chat message');
    }
  }

  async findAll(id?: string): Promise<ChatMessage[]> {
    try {
      this.logger.log('Starting to fetch all chat messages');

      // Check collection existence and connection
      const collectionInfo = await this.chatMessageRepository.count();
      this.logger.log(`Total messages in collection: ${collectionInfo}`);
      // MongoDB with TypeORM doesn't support relations like SQL databases
      let messages: ChatMessage[];
      if (id) {
        messages = await this.chatMessageRepository.find({
          where: { conversationId: new ObjectId(id) },
        });
      } else {
        messages = await this.chatMessageRepository.find();
      }

      this.logger.log(`Raw messages found: ${messages.length}`);
      if (messages.length > 0) {
        this.logger.log(
          'Sample message structure:',
          JSON.stringify(messages[0], null, 2),
        );
      }

      // Filter out deleted messages
      const activeMessages = messages.filter((msg) => {
        // Check if metadata exists and is not deleted
        if (!msg.metadata) {
          this.logger.warn(`Message without metadata found: ${msg._id}`);
          return true; // Include messages without metadata
        }
        return msg.metadata.deleted !== true;
      });

      this.logger.log(
        `Found ${messages.length} total messages, ${activeMessages.length} active messages`,
      );

      return activeMessages;
    } catch (error) {
      this.logger.error('Error retrieving chat messages', error);
      throw new Error('Failed to retrieve chat messages');
    }
  }

  async findOne(id: string): Promise<ChatMessage> {
    try {
      // Check if ID is valid ObjectId format
      if (!ObjectId.isValid(id)) {
        throw new NotFoundException(`Invalid message ID format: ${id}`);
      }

      const chatMessage = await this.chatMessageRepository.findOne({
        where: { _id: new ObjectId(id) }, // Use _id instead of messageID
      });

      if (!chatMessage) {
        throw new NotFoundException(`Chat message with ID ${id} not found`);
      }

      // Check if deleted
      if (chatMessage.metadata && chatMessage.metadata.deleted === true) {
        throw new NotFoundException(`Chat message with ID ${id} not found`);
      }

      return chatMessage;
    } catch (error) {
      this.logger.error(`Error finding chat message ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateChatMessageDto: UpdateChatMessageDto,
  ): Promise<ChatMessage> {
    const chatMessage = await this.findOne(id);

    // Update the fields
    if (updateChatMessageDto.content !== undefined) {
      chatMessage.content = updateChatMessageDto.content;
    }
    if (updateChatMessageDto.sender !== undefined) {
      chatMessage.sender = updateChatMessageDto.sender;
    }

    // Update metadata
    chatMessage.metadata = {
      ...chatMessage.metadata,
      updated: true,
      updatedAt: new Date(),
    };

    try {
      const updatedMessage = await this.chatMessageRepository.save(chatMessage);
      this.logger.log(`Chat message ${id} updated successfully`);
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Error updating chat message ${id}:`, error);
      throw new BadRequestException('Failed to update chat message');
    }
  }

  async remove(id: string): Promise<void> {
    const chatMessage = await this.findOne(id);
    if (!chatMessage) {
      throw new NotFoundException(`Chat message with ID ${id} not found`);
    }
    chatMessage.metadata.deleted = true;
    chatMessage.metadata.deletedAt = new Date();
    try {
      await this.chatMessageRepository.save(chatMessage);
    } catch (error) {
      throw new BadRequestException('Failed to delete chat message');
    }
  }

  // Debug method to test MongoDB connection and data
  async debugChatMessages(): Promise<any> {
    try {
      this.logger.log('=== DEBUG: Chat Messages Collection ===');

      // Check collection count
      const totalCount = await this.chatMessageRepository.count();
      this.logger.log(`Total count: ${totalCount}`);

      // Get all raw documents
      const allMessages = await this.chatMessageRepository.find();
      this.logger.log(`Raw find() results: ${allMessages.length} messages`);

      if (allMessages.length > 0) {
        // Log first few messages structure
        for (let i = 0; i < Math.min(3, allMessages.length); i++) {
          this.logger.log(
            `Message ${i + 1}:`,
            JSON.stringify(allMessages[i], null, 2),
          );
        }
      }

      // Check collection name and database
      const metadata = this.chatMessageRepository.metadata;
      this.logger.log(`Collection name: ${metadata.tableName}`);
      this.logger.log(
        `Database name: ${this.chatMessageRepository.manager.connection.options}`,
      );

      return {
        totalCount,
        sampleMessages: allMessages.slice(0, 3),
        collectionName: metadata.tableName,
        connectionInfo: {
          type: this.chatMessageRepository.manager.connection.options.type,
          database: (
            this.chatMessageRepository.manager.connection.options as any
          ).database,
        },
      };
    } catch (error) {
      this.logger.error('Debug error:', error);
      throw error;
    }
  }
}
