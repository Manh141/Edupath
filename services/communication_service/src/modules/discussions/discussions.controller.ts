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
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ListDiscussionsDto } from './dto/list-discussions.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@ApiTags('Discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List discussions with pagination, filter and search' })
  list(@Query() dto: ListDiscussionsDto) {
    return this.discussionsService.list(undefined, dto);
  }

  @Public()
  @Get(':discussionId')
  @ApiOperation({ summary: 'Get discussion detail' })
  detail(@Param('discussionId') discussionId: string) {
    return this.discussionsService.detail(discussionId);
  }

  @Public()
  @Get(':discussionId/replies')
  @ApiOperation({ summary: 'List all replies for a discussion (Q&A thread)' })
  listReplies(@Param('discussionId') discussionId: string) {
    return this.discussionsService.listReplies(discussionId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new discussion / question' })
  create(@CurrentUser() currentUser: JwtPayload, @Body() dto: CreateDiscussionDto) {
    return this.discussionsService.create(currentUser, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Patch(':discussionId')
  @ApiOperation({ summary: 'Update an existing discussion (owner / instructor / admin)' })
  update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('discussionId') discussionId: string,
    @Body() dto: UpdateDiscussionDto,
  ) {
    return this.discussionsService.update(currentUser, discussionId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Delete(':discussionId')
  @ApiOperation({ summary: 'Soft-delete a discussion (owner / instructor / admin)' })
  remove(@CurrentUser() currentUser: JwtPayload, @Param('discussionId') discussionId: string) {
    return this.discussionsService.softDelete(currentUser, discussionId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Post(':discussionId/replies')
  @ApiOperation({ summary: 'Reply to a discussion or to another reply' })
  reply(
    @CurrentUser() currentUser: JwtPayload,
    @Param('discussionId') discussionId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.discussionsService.createReply(currentUser, discussionId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN)
  @Delete('replies/:replyId')
  @ApiOperation({ summary: 'Soft-delete a reply (owner / instructor / admin)' })
  removeReply(@CurrentUser() currentUser: JwtPayload, @Param('replyId') replyId: string) {
    return this.discussionsService.deleteReply(currentUser, replyId);
  }
}
