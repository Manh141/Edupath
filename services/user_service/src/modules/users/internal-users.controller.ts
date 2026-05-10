import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { UsersService } from './users.service';

@ApiTags('Internal Users')
@ApiHeader({
  name: 'x-internal-service-secret',
  required: true,
  description: 'Shared secret for trusted internal service calls',
})
@Public()
@UseGuards(InternalServiceGuard)
@Controller('internal/users')
export class InternalUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get a user profile by id (internal)' })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.findInternalById(id);
  }

  @ApiOperation({ summary: 'Batch fetch user profiles by ids (internal)' })
  @Post('batch')
  batchGet(@Body() body: { userIds?: string[] }) {
    return this.usersService.findInternalManyByIds(
      Array.isArray(body?.userIds) ? body.userIds : [],
    );
  }
}
