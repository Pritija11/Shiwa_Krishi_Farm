import fs from "fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const rdsCertPath = "/etc/ssl/rds/global-bundle.pem";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ...(fs.existsSync(rdsCertPath)
    ? {
        ssl: {
          ca: fs.readFileSync(rdsCertPath),
          rejectUnauthorized: true,
        },
      }
    : {}),
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
