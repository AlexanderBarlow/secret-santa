import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Seeding database...");

    // Ensure Prisma client is initialized
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    // Check if the admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@domain.com" },
    });

    if (!existingUser) {
      console.log("Creating admin user...");
      await prisma.user.create({
        data: {
          email: "admin@domain.com",
          password: "adminpassword", // ❌ Plaintext password (not recommended)
          isAdmin: true,
        },
      });
    } else {
      console.log("Updating admin user...");
      await prisma.user.update({
        where: { email: "admin@domain.com" },
        data: {
          password: "adminpassword",
          isAdmin: true,
        },
      });
    }

    console.log("Seeding completed.");
    res.status(200).json({ message: "Seeding successful" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ error: "Seeding failed", details: error.message });
  } finally {
    // Ensure Prisma disconnects from DB after seeding
    await prisma.$disconnect();
  }
}
