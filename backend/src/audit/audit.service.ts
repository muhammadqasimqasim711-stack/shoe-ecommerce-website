import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    action: string;
    entity: string;
    entityId?: string | null;
    userId?: string | null;
    details?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? undefined,
        userId: params.userId ?? undefined,
        details: params.details ?? undefined,
      },
    });
  }

  async list(limit = 100, entity?: string) {
    const take = Math.min(Math.max(limit, 1), 500);
    return this.prisma.auditLog.findMany({
      where: entity ? { entity } : undefined,
      take,
      orderBy: { timestamp: 'desc' },
    });
  }
}
