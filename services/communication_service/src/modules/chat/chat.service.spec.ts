import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../common/prisma/prisma.service';
import { ConversationType, MessageType } from '../../common/prisma/prisma-client';
import type { UserClient } from '../external/user.client';
import { ChatEventsService } from './chat-events.service';
import { ChatService } from './chat.service';

function createPrismaMock() {
  const conversation = {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const message = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const messageRead = {
    create: jest.fn(),
    createMany: jest.fn(),
  };
  const conversationParticipant = {
    update: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
  };

  return {
    conversation,
    message,
    messageRead,
    conversationParticipant,
    $transaction: jest.fn((arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)({
          conversation,
          message,
          messageRead,
          conversationParticipant,
        });
      }

      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

describe('ChatService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let userClient: { findManyByIds: jest.Mock };
  let service: ChatService;

  const currentUser = {
    sub: 'user-1',
    email: 'user-1@example.com',
    role: 'student',
    roles: ['student'],
    displayName: 'User One',
    avatarUrl: 'https://cdn.example.com/user-1.png',
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    userClient = {
      findManyByIds: jest.fn().mockResolvedValue([]),
    };
    service = new ChatService(
      prisma as unknown as PrismaService,
      userClient as unknown as UserClient,
      new ChatEventsService(),
    );
  });

  it('rejects starting a direct conversation with yourself', async () => {
    await expect(
      service.getOrCreateDirectConversation(currentUser, currentUser.sub),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reuses an existing direct conversation', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      id: 'conversation-1',
      type: ConversationType.direct,
      deletedAt: null,
      participants: [
        { id: 'participant-1', userId: 'user-1', leftAt: null },
        { id: 'participant-2', userId: 'user-2', leftAt: null },
      ],
    });

    const result = await service.getOrCreateDirectConversation(currentUser, 'user-2');

    expect(result.id).toBe('conversation-1');
    expect(prisma.conversation.create).not.toHaveBeenCalled();
  });

  it('creates a new conversation when no direct conversation exists', async () => {
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    userClient.findManyByIds.mockResolvedValue([
      { id: 'user-1', displayName: 'User One', avatarUrl: '', role: 'student' },
      { id: 'user-2', displayName: 'User Two', avatarUrl: '', role: 'student' },
    ]);
    prisma.conversation.create.mockResolvedValue({
      id: 'conversation-1',
      type: ConversationType.direct,
      participants: [
        {
          id: 'participant-1',
          userId: 'user-1',
          userDisplayName: 'User One',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
        {
          id: 'participant-2',
          userId: 'user-2',
          userDisplayName: 'User Two',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
      ],
    });

    const result = await service.createConversation(currentUser, {
      participantIds: ['user-2'],
      type: ConversationType.direct,
    });

    expect(result.id).toBe('conversation-1');
    expect(prisma.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: ConversationType.direct,
          participants: {
            create: expect.arrayContaining([
              expect.objectContaining({
                userId: 'user-1',
                participantRole: 'owner',
              }),
              expect.objectContaining({
                userId: 'user-2',
                participantRole: 'member',
              }),
            ]),
          },
        }),
      }),
    );
  });

  it('rejects sending empty or whitespace-only messages', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      id: 'conversation-1',
      deletedAt: null,
      participants: [
        {
          id: 'participant-1',
          userId: 'user-1',
          userDisplayName: 'User One',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
      ],
    });

    await expect(
      service.sendMessage(currentUser, 'conversation-1', { content: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sends a valid message and increments unread count for other participants', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      id: 'conversation-1',
      deletedAt: null,
      participants: [
        {
          id: 'participant-1',
          userId: 'user-1',
          userDisplayName: 'User One',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
        {
          id: 'participant-2',
          userId: 'user-2',
          userDisplayName: 'User Two',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
      ],
    });
    prisma.message.create.mockResolvedValue({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'user-1',
      content: 'Hello there',
      createdAt: new Date(),
      type: MessageType.text,
    });
    prisma.conversation.update.mockResolvedValue({});
    prisma.messageRead.create.mockResolvedValue({});
    prisma.conversationParticipant.update.mockResolvedValue({});
    prisma.conversationParticipant.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.sendMessage(currentUser, 'conversation-1', {
      content: '  Hello there  ',
    });

    expect(result.id).toBe('message-1');
    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          conversationId: 'conversation-1',
          senderId: 'user-1',
          content: 'Hello there',
          type: MessageType.text,
        }),
      }),
    );
    expect(prisma.conversationParticipant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: { in: ['participant-2'] },
        },
        data: {
          unreadCount: { increment: 1 },
        },
      }),
    );
  });

  it('rejects sending messages when the user is not a participant', async () => {
    prisma.conversation.findFirst.mockResolvedValue({
      id: 'conversation-1',
      deletedAt: null,
      participants: [
        {
          id: 'participant-1',
          userId: 'user-2',
          userDisplayName: 'User Two',
          userAvatarUrl: '',
          userRole: 'student',
          leftAt: null,
        },
      ],
    });

    await expect(
      service.sendMessage(currentUser, 'conversation-1', { content: 'Hello' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws NotFound when the conversation does not exist', async () => {
    prisma.conversation.findFirst.mockResolvedValue(null);

    await expect(
      service.getConversationDetail(currentUser, 'missing-conversation'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
