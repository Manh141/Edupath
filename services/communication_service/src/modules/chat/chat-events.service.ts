import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'node:events';
import type { Conversation, ConversationParticipant, Message } from '../../common/prisma/prisma-client';

export type ConversationWithParticipants = Conversation & {
  participants: ConversationParticipant[];
};

export type ChatEvent =
  | { type: 'conversation.created'; conversation: ConversationWithParticipants }
  | { type: 'message.created'; conversation: ConversationWithParticipants; message: Message }
  | { type: 'message.deleted'; conversation: ConversationWithParticipants; message: Message }
  | {
      type: 'message.read';
      conversation: ConversationWithParticipants;
      userId: string;
      upToMessageId: string;
    };

@Injectable()
export class ChatEventsService {
  private readonly emitter = new EventEmitter();

  on(listener: (event: ChatEvent) => void): () => void {
    this.emitter.on('chat', listener);
    return () => this.emitter.off('chat', listener);
  }

  emitConversationCreated(conversation: ConversationWithParticipants): void {
    this.emitter.emit('chat', { type: 'conversation.created', conversation });
  }

  emitMessageCreated(conversation: ConversationWithParticipants, message: Message): void {
    this.emitter.emit('chat', { type: 'message.created', conversation, message });
  }

  emitMessageDeleted(conversation: ConversationWithParticipants, message: Message): void {
    this.emitter.emit('chat', { type: 'message.deleted', conversation, message });
  }

  emitMessageRead(
    conversation: ConversationWithParticipants,
    userId: string,
    upToMessageId: string,
  ): void {
    this.emitter.emit('chat', {
      type: 'message.read',
      conversation,
      userId,
      upToMessageId,
    });
  }
}
