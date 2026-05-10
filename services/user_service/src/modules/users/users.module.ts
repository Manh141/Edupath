import { Module } from '@nestjs/common';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { AuthClient } from '../external/auth.client';
import { AdminUsersController } from './admin-users.controller';
import { InternalUsersController } from './internal-users.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, AdminUsersController, InternalUsersController],
  providers: [UsersService, InternalServiceGuard, AuthClient],
  exports: [UsersService],
})
export class UsersModule {}
