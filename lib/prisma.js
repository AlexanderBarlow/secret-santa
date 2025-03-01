import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, using global to persist the Prisma client across requests
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Ensure proper disconnection during process exit
if (process.env.NODE_ENV !== "production") {
  process.on("SIGINT", async () => {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
    process.exit(0); // Gracefully exit after disconnecting
  });
  process.on("SIGTERM", async () => {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
    process.exit(0); // Gracefully exit after disconnecting
  });
}

export default prisma;
