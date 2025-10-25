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

  // --- Fetch real events ---
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Users created in the last 7 days
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { id: true, createdAt: true, role: true },
    });

    // Users matched in the last 7 days (matchedSantaId not null)
    const matchedUsers = await prisma.user.findMany({
      where: {
        matchedSantaId: { not: null },
        updatedAt: { gte: weekAgo },
      },
      select: { id: true, updatedAt: true },
    });

    // Wishlists updated in the last 7 days
    const wishlistUpdates = await prisma.wishlist.findMany({
      where: { updatedAt: { gte: weekAgo } },
      include: {
        user: { select: { id: true, role: true } },
      },
    });

    const activityEvents = [
      ...newUsers.map((u) => ({
        type: "signup",
        role: u.role,
        date: u.createdAt,
      })),
      ...matchedUsers.map((u) => ({
        type: "match",
        date: u.updatedAt,
      })),
      ...wishlistUpdates.map((w) => ({
        type: "wishlist",
        role: w.user.role,
        date: w.updatedAt,
      })),
    ];

    // --- Group by day + type ---
    const grouped = {};
    activityEvents.forEach((e) => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      if (!grouped[key])
        grouped[key] = { date: key, signup: 0, match: 0, wishlist: 0 };
      grouped[key][e.type] += 1;
    });

    const data = Object.values(grouped).sort((a, b) =>
      a.date > b.date ? 1 : -1
    );

    return res.status(200).json({
      summary: {
        totalSignups: newUsers.length,
        totalMatches: matchedUsers.length,
        totalWishlists: wishlistUpdates.length,
      },
      activity: data,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return res.status(500).json({ error: "Failed to fetch activity data" });
  }
}
