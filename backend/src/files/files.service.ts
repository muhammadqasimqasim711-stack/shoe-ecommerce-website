import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync, copyFileSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = process.env.VERCEL
  ? join('/tmp', 'uploads', 'cms')
  : join(process.cwd(), 'uploads', 'cms');

@Injectable()
export class FilesService {
  constructor() {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  async saveUpload(file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
    path?: string;
    filename?: string;
  }) {
    const ext = extname(file.originalname || '') || '.bin';
    const filename = `${randomUUID()}${ext}`;
    const dest = join(UPLOAD_DIR, filename);

    if (file.buffer) {
      writeFileSync(dest, file.buffer);
    } else if (file.path && existsSync(file.path)) {
      copyFileSync(file.path, dest);
    }

    return {
      url: `/uploads/cms/${filename}`,
      filename: file.originalname || filename,
      mimeType: file.mimetype || 'application/octet-stream',
      size: file.size ?? 0,
    };
  }

  async removeByUrl(url: string) {
    const name = url.split('/').pop();
    if (!name) return;
    const dest = join(UPLOAD_DIR, name);
    if (existsSync(dest)) unlinkSync(dest);
  }
}
