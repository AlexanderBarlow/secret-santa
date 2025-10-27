import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { userId, type } = req.query;

  try {
    let questions;

    if (type === "received") {
      questions = await prisma.question.findMany({
        where: { receiverId: Number(userId) },
        include: { wishlistItem: true },
        orderBy: { createdAt: "desc" },
      });
    } else if (type === "asked") {
      questions = await prisma.question.findMany({
        where: { askerId: Number(userId) },
        include: { wishlistItem: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    return res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
}
