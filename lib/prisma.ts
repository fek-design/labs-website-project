import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function parseConnectionConfig(rawUrl?: string) {
  const fallback = {
    host: "127.0.0.1",
    port: 3306,
    user: "zealand_admin",
    password: "local_admin_secure",
    database: "zealand_labs",
    connectionLimit: 25,
    acquireTimeout: 30000,
    connectTimeout: 10000,
  };

  if (!rawUrl) return fallback;

  try {
    const normalized = rawUrl.replace(/^(mysql|mariadb):\/\//, "http://");
    const parsed = new URL(normalized);
    const host = parsed.hostname === "localhost" ? "127.0.0.1" : (parsed.hostname || "127.0.0.1");

    return {
      host,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || "zealand_admin"),
      password: decodeURIComponent(parsed.password || "local_admin_secure"),
      database: parsed.pathname.replace(/^\//, "") || "zealand_labs",
      connectionLimit: 25,
      acquireTimeout: 30000,
      connectTimeout: 10000,
    };
  } catch {
    return fallback;
  }
}

const poolConfig = parseConnectionConfig(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaMariaDb(poolConfig);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;