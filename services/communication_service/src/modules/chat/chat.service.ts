import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ConversationType,
  MessageType,
  ParticipantRole,
  Prisma,
} from '../../common/prisma/prisma-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hasAnyRole, ROLES } from '../../common/constants/roles.constant';
import {
  buildPaginationMeta,
  normalizePagination,
  PaginatedResult,
} from '../../common/utils/pagination';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UserClient } from '../external/user.client';
import { ChatEventsService } from './chat-events.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListConversationsDto } from './dto/list-conversations.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { SendMessageDto } from './dto/send-message.dto';

const conversationInclude = {
  participants: true,
} satisfies Prisma.ConversationInclude;

export type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userClient: UserClient,
    private readonly chatEvents: ChatEventsService,
  ) {}

  async listMyConversations(
    currentUser: JwtPayload,
    dto: ListConversationsDto,
  ): Promise<
    PaginatedResult<{
      conversation: ConversationWithParticipants;
      myParticipant: ConversationWithParticipants['participants'][number];
      lastMessage:
        | (Prisma.MessageGetPayload<Record<string, never>>)
        | null;
    }>
  > {
    const { page, limit, skip, take } = normalizePagination(dto);

    const includeArchived = dto.includeArchived === 'true';
    const unreadOnly = dto.unreadOnly === 'true';

    const where: Prisma.ConversationWhereInput = {
      deletedAt: null,
      participants: {
        some: {
          userId: currentUser.sub,
          ...(includeArchived ? {} : { isArchived: false }),
          leftAt: null,
          ...(unreadOnly ? { unreadCount: { gt: 0 } } : {}),
        },
      },
      ...(dto.type ? { type: dto.type } : {}),
      ...(dto.courseId ? { courseId: dto.courseId } : {}),
      ...(dto.search
        ? {
            OR: [
              { title: { contains: dto.search, mode: 'insensitive' } },
              {
                participants: {
                  some: {
                    userDisplayName: { contains: dto.search, mode: 'insensitive' },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [total, conversations] = await this.prisma.$transaction([
      this.prisma.conversation.count({ where }),
      this.prisma.conversation.findMany({
        where,
        include: conversationInclude,
        orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
        skip,
        take,
      }),
    ]);

    const lastMessageIds = conversations
      .map((conversation) => conversation.lastMessageId)
      .filter((id): id is string => Boolean(id));

    const lastMessages =
      lastMessageIds.length > 0
        ? await this.prisma.message.findMany({
            where: { id: { in: lastMessageIds } },
          })
        : [];

    const lastMessageMap = new Map(lastMessages.map((message) => [message.id, message]));

    const items = conversations.map((conversation) => {
      const myParticipant = conversation.participants.find(
        (participant) => participant.userId === currentUser.sub,
      )!;
      const lastMessage = conversation.lastMessageId
        ? (lastMessageMap.get(conversation.lastMessageId) ?? null)
        : null;
      return {
        conversation,
        myParticipant,
        lastMessage,
      };
    });

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getOrCreateDirectConversation(currentUser: JwtPayload, otherUserId: string) {
    if (otherUserId === currentUser.sub) {
      throw new BadRequestException('Cannot start a direct conversation with yourself.');
    }

    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.direct,
        deletedAt: null,
        AND: [
          { participants: { some: { userId: currentUser.sub, leftAt: null } } },
          { participants: { some: { userId: otherUserId, leftAt: null } } },
        ],
      },
      include: conversationInclude,
    });

    if (existing && existing.participants.length === 2) {
      return existing;
    }

    return this.createConversation(currentUser, {
      type: ConversationType.direct,
      participantIds: [otherUserId],
    });
  }

  async createConversation(currentUser: JwtPayload, dto: CreateConversationDto) {
    const otherIds = Array.from(new Set(dto.participantIds.filter((id) => id !== currentUser.sub)));
    if (otherIds.length === 0) {
      throw new BadRequestException('At least one other participant is required.');
    }

    const allUserIds = Array.from(new Set([currentUser.sub, ...otherIds]));
    const profiles = await this.userClient.findManyByIds(allUserIds);
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

    const type = dto.type ?? (otherIds.length > 1 ? ConversationType.support : ConversationType.direct);

    if (type === ConversationType.direct && otherIds.length !== 1) {
      throw new BadRequestException('Direct conversations require exactly two participants.');
    }

    if (type === ConversationType.direct) {
      const otherId = otherIds[0]!;
      const existing = await this.prisma.conversation.findFirst({
        where: {
          type: ConversationType.direct,
          deletedAt: null,
          AND: [
            { participants: { some: { userId: currentUser.sub, leftAt: null } } },
            { participants: { some: { userId: otherId, leftAt: null } } },
          ],
        },
        include: conversationInclude,
      });
      if (existing) {
        if (dto.initialMessage) {
          await this.sendMessage(currentUser, existing.id, {
            content: dto.initialMessage,
            type: MessageType.text,
          });
        }
        return existing;
      }
    }

    const conversation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.conversation.create({
        data: {
          type,
          title: dto.title ?? '',
          courseId: dto.courseId ?? null,
          createdBy: currentUser.sub,
          participants: {
            create: allUserIds.map((userId) => {
              const profile = profileMap.get(userId);
              const isCurrent = userId === currentUser.sub;
              return {
                userId,
                userDisplayName:
                  profile?.displayName ??
                  profile?.fullName ??
                  (isCurrent ? currentUser.displayName ?? currentUser.email : ''),
                userAvatarUrl:
                  profile?.avatarUrl ?? (isCurrent ? currentUser.avatarUrl ?? '' : ''),
                userRole: profile?.role ?? (isCurrent ? currentUser.role ?? 'student' : 'student'),
                participantRole: isCurrent ? ParticipantRole.owner : ParticipantRole.member,
              };
            }),
          },
        },
        include: conversationInclude,
      });
      return created;
    });

    if (dto.initialMessage) {
      await this.sendMessage(currentUser, conversation.id, {
        content: dto.initialMessage,
        type: MessageType.text,
      });
    }

    this.chatEvents.emitConversationCreated(conversation);
    return conversation;
  }

  async getConversationDetail(currentUser: JwtPayload, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, deletedAt: null },
      include: conversationInclude,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }
    this.assertParticipant(conversation, currentUser);
    return conversation;
  }

  async listMessages(currentUser: JwtPayload, conversationId: string, dto: ListMessagesDto) {
    const conversation = await this.getConversationDetail(currentUser, conversationId);
    const { page, limit, skip, take } = normalizePagination(dto);

    let beforeTimestamp: Date | undefined;
    if (dto.before) {
      const cursor = await this.prisma.message.findUnique({
        where: { id: dto.before },
        select: { createdAt: true, conversationId: true },
      });
      if (!cursor || cursor.conversationId !== conversation.id) {
        throw new NotFoundException('Cursor message not found in conversation.');
      }
      beforeTimestamp = cursor.createdAt;
    }

    const where: Prisma.MessageWhereInput = {
      conversationId: conversation.id,
      deletedAt: null,
      ...(beforeTimestamp ? { createdAt: { lt: beforeTimestamp } } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: beforeTimestamp ? 0 : skip,
        take,
      }),
    ]);

    return {
      items: items.reverse(),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async sendMessage(currentUser: JwtPayload, conversationId: string, dto: SendMessageDto) {
    const conversation = await this.getConversationDetail(currentUser, conversationId);
    const myParticipant = conversation.participants.find(
      (participant) => participant.userId === currentUser.sub,
    )!;

    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Message content cannot be empty.');
    }

    const otherParticipants = conversation.participants.filter(
      (participant) => participant.userId !== currentUser.sub && !participant.leftAt,
    );

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: currentUser.sub,
          senderDisplayName: myParticipant.userDisplayName,
          senderAvatarUrl: myParticipant.userAvatarUrl,
          senderRole: myParticipant.userRole,
          type: dto.type ?? MessageType.text,
          content,
          ...(dto.metadata !== undefined ? { metadata: dto.metadata as Prisma.InputJsonValue } : {}),
        },
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: created.createdAt,
          lastMessageId: created.id,
        },
      });

      await tx.messageRead.create({
        data: {
          messageId: created.id,
          userId: currentUser.sub,
        },
      });

      await tx.conversationParticipant.update({
        where: { id: myParticipant.id },
        data: {
          lastReadMessageId: created.id,
          lastReadAt: new Date(),
        },
      });

      if (otherParticipants.length > 0) {
        await tx.conversationParticipant.updateMany({
          where: {
            id: { in: otherParticipants.map((participant) => participant.id) },
          },
          data: {
            unreadCount: { increment: 1 },
          },
        });
      }

      return created;
    });

    this.chatEvents.emitMessageCreated(conversation, message);
    return message;
  }

  async markRead(currentUser: JwtPayload, conversationId: string, dto: MarkReadDto) {
    const conversation = await this.getConversationDetail(currentUser, conversationId);
    const myParticipant = conversation.participants.find(
      (participant) => participant.userId === currentUser.sub,
    )!;

    let upToMessage: { id: string; createdAt: Date } | null = null;
    if (dto?.upToMessageId) {
      const found = await this.prisma.message.findUnique({
        where: { id: dto.upToMessageId },
        select: { id: true, createdAt: true, conversationId: true },
      });
      if (!found || found.conversationId !== conversation.id) {
        throw new NotFoundException('Message not found in this conversation.');
      }
      upToMessage = { id: found.id, createdAt: found.createdAt };
    } else {
      const last = await this.prisma.message.findFirst({
        where: { conversationId: conversation.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true },
      });
      if (last) {
        upToMessage = last;
      }
    }

    if (!upToMessage) {
      return { unreadCount: 0 };
    }

    await this.prisma.$transaction(async (tx) => {
      const unreadMessages = await tx.message.findMany({
        where: {
          conversationId: conversation.id,
          createdAt: { lte: upToMessage!.createdAt },
          deletedAt: null,
          senderId: { not: currentUser.sub },
          reads: { none: { userId: currentUser.sub } },
        },
        select: { id: true },
      });

      if (unreadMessages.length > 0) {
        await tx.messageRead.createMany({
          data: unreadMessages.map((message) => ({
            messageId: message.id,
            userId: currentUser.sub,
          })),
          skipDuplicates: true,
        });
      }

      await tx.conversationParticipant.update({
        where: { id: myParticipant.id },
        data: {
          unreadCount: 0,
          lastReadMessageId: upToMessage!.id,
          lastReadAt: new Date(),
        },
      });
    });

    this.chatEvents.emitMessageRead(conversation, currentUser.sub, upToMessage.id);
    return { unreadCount: 0, upToMessageId: upToMessage.id };
  }

  async getUnreadSummary(currentUser: JwtPayload) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: {
        userId: currentUser.sub,
        leftAt: null,
        isArchived: false,
        conversation: { deletedAt: null },
      },
      select: {
        conversationId: true,
        unreadCount: true,
      },
    });

    const totalUnread = participants.reduce((sum, item) => sum + item.unreadCount, 0);
    const conversationsWithUnread = participants.filter((item) => item.unreadCount > 0);

    return {
      totalUnread,
      conversationsWithUnread: conversationsWithUnread.length,
      perConversation: participants,
    };
  }

  async deleteMessage(currentUser: JwtPayload, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: { include: conversationInclude } },
    });
    if (!message || message.deletedAt) {
      throw new NotFoundException('Message not found.');
    }

    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);
    if (!isAdmin && message.senderId !== currentUser.sub) {
      throw new ForbiddenException('You can only delete your own messages.');
    }

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date(), content: '' },
    });

    this.chatEvents.emitMessageDeleted(message.conversation, updated);
    return updated;
  }

  async archiveConversation(currentUser: JwtPayload, conversationId: string, archived: boolean) {
    const conversation = await this.getConversationDetail(currentUser, conversationId);
    const myParticipant = conversation.participants.find(
      (participant) => participant.userId === currentUser.sub,
    )!;

    return this.prisma.conversationParticipant.update({
      where: { id: myParticipant.id },
      data: { isArchived: archived },
    });
  }

  async listInstructorConversations(
    currentUser: JwtPayload,
    dto: ListConversationsDto,
  ) {
    if (!hasAnyRole(currentUser, [ROLES.INSTRUCTOR, ROLES.ADMIN])) {
      throw new ForbiddenException('Instructor or admin role required.');
    }
    return this.listMyConversations(currentUser, dto);
  }

  private assertParticipant(
    conversation: ConversationWithParticipants,
    currentUser: JwtPayload,
  ): void {
    const isAdmin = hasAnyRole(currentUser, [ROLES.ADMIN]);
    const isMember = conversation.participants.some(
      (participant) => participant.userId === currentUser.sub && !participant.leftAt,
    );
    if (!isMember && !isAdmin) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }
  }
}
