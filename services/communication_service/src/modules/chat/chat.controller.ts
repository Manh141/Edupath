import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListConversationsDto } from './dto/list-conversations.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
@Controller('conversations')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'List my conversations with last message + unread count' })
  list(@CurrentUser() currentUser: JwtPayload, @Query() dto: ListConversationsDto) {
    return this.chatService.listMyConversations(currentUser, dto);
  }

  @Get('unread-summary')
  @ApiOperation({ summary: 'Total unread messages and conversations with unread' })
  unreadSummary(@CurrentUser() currentUser: JwtPayload) {
    return this.chatService.getUnreadSummary(currentUser);
  }

  @Post()
  @ApiOperation({ summary: 'Create or reuse a direct/group conversation' })
  create(@CurrentUser() currentUser: JwtPayload, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(currentUser, dto);
  }

  @Post('direct/:userId')
  @ApiOperation({ summary: 'Get or create a direct conversation with another user' })
  getOrCreateDirect(
    @CurrentUser() currentUser: JwtPayload,
    @Param('userId') userId: string,
  ) {
    return this.chatService.getOrCreateDirectConversation(currentUser, userId);
  }

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get conversation detail (with participants)' })
  detail(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getConversationDetail(currentUser, conversationId);
  }

  @Get(':conversationId/messages')
  @ApiOperation({ summary: 'List messages in a conversation' })
  listMessages(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
    @Query() dto: ListMessagesDto,
  ) {
    return this.chatService.listMessages(currentUser, conversationId, dto);
  }

  @Post(':conversationId/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  sendMessage(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(currentUser, conversationId, dto);
  }

  @Post(':conversationId/read')
  @ApiOperation({ summary: 'Mark messages as seen up to a given message id (or latest)' })
  markRead(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.chatService.markRead(currentUser, conversationId, dto);
  }

  @Patch(':conversationId/archive')
  @ApiOperation({ summary: 'Archive a conversation for myself' })
  archive(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.archiveConversation(currentUser, conversationId, true);
  }

  @Patch(':conversationId/unarchive')
  @ApiOperation({ summary: 'Unarchive a conversation for myself' })
  unarchive(
    @CurrentUser() currentUser: JwtPayload,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.archiveConversation(currentUser, conversationId, false);
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Soft-delete a message (sender or admin)' })
  deleteMessage(
    @CurrentUser() currentUser: JwtPayload,
    @Param('messageId') messageId: string,
  ) {
    return this.chatService.deleteMessage(currentUser, messageId);
  }
}
