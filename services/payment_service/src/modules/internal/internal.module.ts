import { Module } from '@nestjs/common';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [InternalController],
  providers: [InternalService, InternalServiceGuard],
  exports: [InternalService],
})
export class InternalModule {}
