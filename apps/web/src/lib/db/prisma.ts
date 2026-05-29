import "server-only";

import { createPrismaClient } from "@note6/database/client";

import { env } from "@/config/env";

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof createPrismaClient>;
};

const prisma =
  globalForPrisma.prisma || createPrismaClient(env.DATABASE_URL);

// eslint-disable-next-line no-restricted-properties
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;