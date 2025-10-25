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
    // Fetch users and wishlists
    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        select: { id: true },
      }),
      prisma.wishlist.findMany({
        include: { items: true },
        orderBy: { id: "asc" },
      }),
    ]);

    const totalUsers = users.length;
    const totalWishlists = wishlists.length;

    // Users who have at least one wishlist
    const usersWithWishlists = new Set(wishlists.map((w) => w.userId));

    // Users who have at least one item
    const usersWithItems = new Set(
      wishlists.filter((w) => w.items.length > 0).map((w) => w.userId)
    );

    const completionRate =
      totalUsers > 0 ? Math.round((usersWithItems.size / totalUsers) * 100) : 0;

    // Count top wishlist items (preserve casing for display)
    const itemCounts = {};
    for (const w of wishlists) {
      for (const item of w.items) {
        const name = item.item?.trim();
        if (!name) continue;
        const key = name.toLowerCase();
        itemCounts[key] = itemCounts[key] || { item: name, count: 0 };
        itemCounts[key].count += 1;
      }
    }

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate wishlist creation by date for activity chart
    const activityMap = {};
    for (const w of wishlists) {
      const date =
        w.updatedAt?.toISOString().slice(0, 10) ||
        w.createdAt?.toISOString().slice(0, 10);
      if (!date) continue;
      activityMap[date] = (activityMap[date] || 0) + 1;
    }

    // Return last 14 days with 0 fill
    const today = new Date();
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i));
      const dateKey = d.toISOString().slice(0, 10);
      return {
        date: dateKey,
        count: activityMap[dateKey] || 0,
      };
    });

    return res.status(200).json({
      summary: {
        totalUsers,
        totalWishlists,
        usersWithWishlists: usersWithWishlists.size,
        usersWithItems: usersWithItems.size,
        completionRate,
      },
      topItems,
      wishlistActivity: last14Days,
    });
  } catch (error) {
    console.error("❌ Wishlist analytics error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist analytics" });
  }
}
