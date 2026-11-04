import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isStaffRole } from '../common/staff-roles';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async notifyStaff(type: string, title: string, payload: Prisma.InputJsonValue) {
    const staff = await this.prisma.user.findMany({
      where: {
        disabled: false,
        role: { name: { not: 'CUSTOMER' } },
      },
      select: { id: true, role: { select: { name: true } } },
    });

    const staffIds = staff.filter((u) => isStaffRole(u.role.name)).map((u) => u.id);
    if (!staffIds.length) {
      // store as global (no user) notification for dashboard
      await this.prisma.notification.create({
        data: { type, title, payload, userId: null },
      });
      return;
    }

    await this.prisma.notification.createMany({
      data: staffIds.map((userId) => ({
        userId,
        type,
        title,
        payload,
      })),
    });
  }

  async listForUser(userId: string, limit = 50) {
    const take = Math.min(Math.max(limit, 1), 200);
    return this.prisma.notification.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, userId: string) {
    const n = await this.prisma.notification.findFirst({
      where: { id, OR: [{ userId }, { userId: null }] },
    });
    if (!n) return null;
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        read: false,
        OR: [{ userId }, { userId: null }],
      },
      data: { read: true },
    });
    return { ok: true };
  }

  async unreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        read: false,
        OR: [{ userId }, { userId: null }],
      },
    });
  }
}
