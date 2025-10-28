import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: "Forbidden" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 13); // 14-day window

    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { id: true, createdAt: true, matchedSantaId: true },
      }),
      prisma.wishlist.findMany({
        where: {
          OR: [
            { createdAt: { gte: startDate } },
            { updatedAt: { gte: startDate } },
          ],
        },
        select: { createdAt: true, updatedAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Build 14-day baseline
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return {
        date: d.toISOString().split("T")[0],
        signups: 0,
        matches: 0,
        wishlists: 0,
      };
    });

    // Signups + matches
    for (const user of users) {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      const entry = last14Days.find((d) => d.date === dateStr);
      if (entry) {
        entry.signups += 1;
        if (user.matchedSantaId) entry.matches += 1;
      }
    }

    // Wishlist updates
    for (const w of wishlists) {
      const dateStr = (w.updatedAt || w.createdAt).toISOString().split("T")[0];
      const entry = last14Days.find((d) => d.date === dateStr);
      if (entry) entry.wishlists += 1;
    }

    const summary = {
      totalSignups: users.length,
      totalMatches: users.filter((u) => u.matchedSantaId).length,
      totalWishlists: wishlists.length,
    };

    res.status(200).json({ activity: last14Days, summary });
  } catch (error) {
    console.error("❌ Error building activity data:", error);
    res.status(500).json({ error: "Failed to fetch activity data" });
  }
}
