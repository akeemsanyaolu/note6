import type { PrismaClient } from "@note6/database";
import { createPrismaClient } from "@note6/database/client";

import { getEnv } from "@/config/env";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient(getEnv().DATABASE_URL);

export default prisma;