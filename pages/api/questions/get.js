import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, type } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let questions = [];

    if (type === "received") {
      // 🎅 Recipient view — shows incoming questions about their items
      questions = await prisma.question.findMany({
        where: { receiverId: Number(userId) },
        include: {
          wishlistItem: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (type === "sent") {
      // 🎁 Santa view — shows questions they’ve sent + any replies
      questions = await prisma.question.findMany({
        where: { askerId: Number(userId) },
        include: {
          wishlistItem: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
