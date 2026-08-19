import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "mysql://zealand_admin:local_admin_secure@localhost:3306/zealand_labs",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
