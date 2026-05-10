import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, Prisma } from '../prisma/prisma-client';

export interface AuditLogParams {
  action: AuditAction;
  actorId?: string;
  actorEmail?: string;
  targetId?: string;
  targetEmail?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditLogParams): Promise<void> {
    try {
      const data: Prisma.AuditLogUncheckedCreateInput = params;
      await this.prisma.auditLog.create({ data });
    } catch (err) {
      // Audit log failure must never block the main flow
      this.logger.error('Failed to write audit log', { params, err });
    }
  }
}
