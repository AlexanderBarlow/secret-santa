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
    // ✅ Fetch all wishlists with users and items
    const wishlists = await prisma.wishlist.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        items: true, // ✅ includes WishlistItem array
      },
      orderBy: { id: "asc" },
    });

    console.log("✅ Found wishlists:", wishlists.length);

    if (!wishlists.length) {
      return res.status(200).json({
        summary: { totalWishlists: 0, completed: 0, completionRate: 0 },
        topItems: [],
        wishlists: [],
      });
    }

    // ✅ Count totals
    const totalWishlists = wishlists.length;
    const completed = wishlists.filter((w) => w.items.length > 0).length;
    const completionRate = Math.round((completed / totalWishlists) * 100);

    // ✅ Count top items
    const itemCounts = {};
    for (const w of wishlists) {
      for (const item of w.items) {
        const name = item.item?.trim().toLowerCase();
        if (!name) continue;
        itemCounts[name] = (itemCounts[name] || 0) + 1;
      }
    }

    const topItems = Object.entries(itemCounts)
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
    console.error("❌ Error fetching wishlist data:", error);
    res.status(500).json({ error: "Failed to fetch wishlist analytics" });
  }
}
