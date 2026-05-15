import { Module } from '@nestjs/common';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { AdminAccountsConfig } from './admin-accounts.config';
import { AdminBootstrapService } from './admin-bootstrap.service';
import { AdminController } from './admin.controller';
import { InternalAdminController } from './internal-admin.controller';

@Module({
  controllers: [AdminController, InternalAdminController],
  providers: [AdminAccountsConfig, AdminBootstrapService, InternalServiceGuard],
  exports: [AdminAccountsConfig, AdminBootstrapService],
})
export class AdminModule {}
