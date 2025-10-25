import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // --- Verify admin access ---
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // --- Fetch real wishlist data ---
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
          select: {
            id: true,
            item: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const total = wishlists.length;
    const completed = wishlists.filter((w) => w.items.length > 0).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // Count top items for analytics display
    const itemCount = {};
    wishlists.forEach((w) => {
      w.items.forEach((i) => {
        const name = i.item.trim();
        if (name) itemCount[name] = (itemCount[name] || 0) + 1;
      });
    });

    const topItems = Object.entries(itemCount)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      summary: {
        totalWishlists: total,
        completed,
        completionRate,
      },
      topItems,
      wishlists,
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return res.status(500).json({ error: "Failed to fetch wishlist data" });
  }
}
