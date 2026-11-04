import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createContact(input: { name: string; email: string; message: string }) {
    await this.prisma.supportMessage.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        message: input.message.trim(),
      },
    });
    return { ok: true };
  }
}
