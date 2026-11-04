import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string, preference: string = 'ALL') {
    const normalized = email.trim().toLowerCase();
    const subscriber = await this.prisma.newsletterSubscriber.upsert({
      where: { email: normalized },
      update: {
        status: 'SUBSCRIBED',
        preference: preference.toUpperCase(),
      },
      create: {
        email: normalized,
        preference: preference.toUpperCase(),
        status: 'SUBSCRIBED',
      },
    });
    return { ok: true, subscriber };
  }

  async updatePreference(email: string, preference: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });
    if (!existing) {
      throw new NotFoundException('Subscriber not found');
    }
    const updated = await this.prisma.newsletterSubscriber.update({
      where: { email: normalized },
      data: {
        preference: preference.toUpperCase(),
        status: 'SUBSCRIBED',
      },
    });
    return { ok: true, subscriber: updated };
  }

  async unsubscribe(email: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });
    if (existing) {
      await this.prisma.newsletterSubscriber.update({
        where: { email: normalized },
        data: { status: 'UNSUBSCRIBED' },
      });
    }
    return { ok: true, email: normalized, status: 'UNSUBSCRIBED' };
  }

  async getStatus(email: string) {
    const normalized = email.trim().toLowerCase();
    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });
    if (!subscriber) {
      return { isSubscribed: false, preference: 'ALL' };
    }
    return {
      isSubscribed: subscriber.status === 'SUBSCRIBED',
      preference: subscriber.preference,
      email: subscriber.email,
    };
  }
}

