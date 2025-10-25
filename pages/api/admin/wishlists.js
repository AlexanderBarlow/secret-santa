import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: "Forbidden" });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const wishlists = await prisma.wishlist.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            Accepted: true,
            createdAt: true,
          },
        },
        items: {
          select: { item: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const totalWishlists = wishlists.length;
    const completed = wishlists.filter((w) => w.items.length > 0).length;
    const completionRate = totalWishlists
      ? Math.round((completed / totalWishlists) * 100)
      : 0;

    const itemCounter = {};
    for (const w of wishlists) {
      for (const i of w.items) {
        const clean = i.item?.trim().toLowerCase();
        if (!clean) continue;
        itemCounter[clean] = (itemCounter[clean] || 0) + 1;
      }
    }

    const topItems = Object.entries(itemCounter)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      summary: {
        totalWishlists,
        completed,
        completionRate,
      },
      topItems,
      wishlists,
    });
  } catch (error) {
    console.error("❌ Error fetching wishlists:", error);
    res.status(500).json({ error: "Failed to fetch wishlists" });
  }
}
