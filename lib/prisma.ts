import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const rawUrl =
  process.env.DATABASE_URL ||
  "mysql://zealand_admin:local_admin_secure@127.0.0.1:3306/zealand_labs";

// @prisma/adapter-mariadb expects mariadb:// protocol and explicit 127.0.0.1 to avoid macOS IPv6 resolution timeouts
const connectionString = rawUrl
  .replace(/^mysql:\/\//, "mariadb://")
  .replace("@localhost:", "@127.0.0.1:");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaMariaDb(connectionString);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;