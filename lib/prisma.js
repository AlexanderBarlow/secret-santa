import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });
}

prisma = globalForPrisma.prisma;

// Gracefully disconnect Prisma on process exit
process.on("SIGINT", async () => {
  console.log("Disconnecting Prisma client...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Disconnecting Prisma client...");
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
