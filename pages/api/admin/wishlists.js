import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

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
    // Fetch all users and their wishlists
    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, email: true },
      }),
      prisma.wishlist.findMany({
        include: {
          items: true,
        },
        orderBy: { id: "asc" },
      }),
    ]);

    const totalUsers = users.length;
    const totalWishlists = wishlists.length;

    // Users that have at least one wishlist entry (regardless of pendingAccept)
    const usersWithWishlists = new Set(wishlists.map((w) => w.userId));

    // Users that actually have items in their wishlist
    const usersWithItems = new Set(
      wishlists.filter((w) => w.items.length > 0).map((w) => w.userId)
    );

    const completionRate =
      totalUsers > 0 ? Math.round((usersWithItems.size / totalUsers) * 100) : 0;

    // Count top requested items
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

    // Generate simple wishlist activity trend by date
    const wishlistActivity = wishlists
      .filter((w) => w.createdAt)
      .map((w) => ({
        date: w.createdAt.toISOString().slice(0, 10),
      }));

    return res.status(200).json({
      summary: {
        totalUsers,
        totalWishlists,
        usersWithWishlists: usersWithWishlists.size,
        usersWithItems: usersWithItems.size,
        completionRate,
      },
      topItems,
      wishlistActivity,
      wishlists,
    });
  } catch (error) {
    console.error("❌ Wishlist analytics error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist analytics" });
  }
}
