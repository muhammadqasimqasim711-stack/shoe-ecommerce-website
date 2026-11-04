import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    const url = config.get<string>("DATABASE_URL") ?? "file:./prisma/dev.db";
    let adapter: any;
    if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
      const pool = new Pool({ connectionString: url });
      adapter = new PrismaPg(pool);
    } else {
      adapter = new PrismaBetterSqlite3({ url });
    }
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
