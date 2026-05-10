import { Logger, OnModuleDestroy, OnModuleInit, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilter } from '../../common/filters/all-exceptions.filter';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ChatEvent, ChatEventsService } from './chat-events.service';
import { ChatService } from './chat.service';

interface AuthSocket extends Socket {
  data: { user?: JwtPayload };
}

function userRoom(userId: string): string {
  return `user:${userId}`;
}

function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

@UseFilters(new AllExceptionsFilter())
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: (process.env.WEB_ORIGIN ?? '*').split(',').map((value) => value.trim()),
    credentials: true,
  },
  path: process.env.SOCKET_PATH ?? '/socket.io',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ChatGateway.name);
  private unsubscribe?: () => void;

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly chatEvents: ChatEventsService,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.chatEvents.on((event) => this.handleEvent(event));
  }

  onModuleDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  async handleConnection(client: AuthSocket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect(true);
        return;
      }

      const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
      client.data.user = payload;
      await client.join(userRoom(payload.sub));
      this.logger.debug(`Socket connected userId=${payload.sub} sid=${client.id}`);
    } catch (error) {
      this.logger.warn(`Socket auth failed: ${(error as Error).message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthSocket): void {
    this.logger.debug(`Socket disconnected sid=${client.id}`);
  }

  @SubscribeMessage('conversation.join')
  async handleJoin(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const user = this.requireUser(client);
    if (!payload?.conversationId) {
      throw new WsException('conversationId is required.');
    }
    await this.chatService.getConversationDetail(user, payload.conversationId);
    await client.join(conversationRoom(payload.conversationId));
    return { ok: true };
  }

  @SubscribeMessage('conversation.leave')
  async handleLeave(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: { conversationId: string },
  ) {
    if (!payload?.conversationId) {
      return { ok: false };
    }
    await client.leave(conversationRoom(payload.conversationId));
    return { ok: true };
  }

  @SubscribeMessage('message.send')
  async handleSendMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    const user = this.requireUser(client);
    if (!payload?.conversationId || !payload?.content) {
      throw new WsException('conversationId and content are required.');
    }
    return this.chatService.sendMessage(user, payload.conversationId, {
      content: payload.content,
    });
  }

  @SubscribeMessage('message.read')
  async handleRead(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: { conversationId: string; upToMessageId?: string },
  ) {
    const user = this.requireUser(client);
    if (!payload?.conversationId) {
      throw new WsException('conversationId is required.');
    }
    return this.chatService.markRead(user, payload.conversationId, {
      upToMessageId: payload.upToMessageId,
    });
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
  ) {
    const user = this.requireUser(client);
    if (!payload?.conversationId) return;
    this.server.to(conversationRoom(payload.conversationId)).emit('typing', {
      conversationId: payload.conversationId,
      userId: user.sub,
      isTyping: Boolean(payload.isTyping),
    });
  }

  private handleEvent(event: ChatEvent): void {
    if (!this.server) return;

    if (event.type === 'message.created') {
      const room = conversationRoom(event.conversation.id);
      this.server.to(room).emit('message.created', {
        conversationId: event.conversation.id,
        message: event.message,
      });
      for (const participant of event.conversation.participants) {
        if (!participant.leftAt) {
          this.server.to(userRoom(participant.userId)).emit('conversation.updated', {
            conversationId: event.conversation.id,
            lastMessageId: event.message.id,
            lastMessageAt: event.message.createdAt,
          });
        }
      }
      return;
    }

    if (event.type === 'message.deleted') {
      this.server
        .to(conversationRoom(event.conversation.id))
        .emit('message.deleted', { messageId: event.message.id });
      return;
    }

    if (event.type === 'message.read') {
      this.server.to(conversationRoom(event.conversation.id)).emit('message.read', {
        conversationId: event.conversation.id,
        userId: event.userId,
        upToMessageId: event.upToMessageId,
      });
      return;
    }

    if (event.type === 'conversation.created') {
      for (const participant of event.conversation.participants) {
        this.server
          .to(userRoom(participant.userId))
          .emit('conversation.created', { conversation: event.conversation });
      }
    }
  }

  private requireUser(client: AuthSocket): JwtPayload {
    if (!client.data.user) {
      throw new WsException('Unauthorized.');
    }
    return client.data.user;
  }

  private extractToken(client: AuthSocket): string | null {
    const fromAuth = client.handshake.auth?.token;
    if (typeof fromAuth === 'string' && fromAuth.length > 0) {
      return fromAuth.replace(/^Bearer\s+/i, '');
    }
    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }
    const queryToken = client.handshake.query?.token;
    if (typeof queryToken === 'string') {
      return queryToken;
    }
    return null;
  }
}
