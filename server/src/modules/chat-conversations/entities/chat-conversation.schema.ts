import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity({ name: 'ChatConversation' })
export class ChatConversation {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  conversationTitle: string;
  @Column()
  noteId: string;
  @Column('simple-json')
  metadata: {
    createdAt: Date;
    createdBy: string;
    updated: boolean;
    updatedAt?: Date;
    deleted: boolean;
    deletedAt?: Date;
  };

  constructor(partial: Partial<ChatConversation>) {
    Object.assign(this, partial);
  }
}
