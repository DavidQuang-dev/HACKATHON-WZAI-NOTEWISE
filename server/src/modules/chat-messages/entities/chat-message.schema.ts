import { ObjectId } from 'mongodb';
import { ChatMessageSender } from 'src/common/enums/chat-message-sender.enum';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'ChatMessage' })
export class ChatMessage {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column({
    type: 'enum',
    enum: ChatMessageSender,
    default: ChatMessageSender.USER,
  })
  sender: ChatMessageSender;

  @Column()
  content: string;

  @Column()
  conversationId: ObjectId;

  @Column('simple-json')
  metadata: {
    createdAt: Date;
    createdBy: string;
    updated: boolean;
    updatedAt?: Date;
    deleted: boolean;
    deletedAt?: Date;
  };

  constructor(partial: Partial<ChatMessage>) {
    Object.assign(this, partial);
  }
}
