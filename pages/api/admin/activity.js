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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        role: true,
        matchedSantaId: true,
      },
    });

    const wishlists = await prisma.wishlist.findMany({
      include: { items: true },
    });

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        date: d.toISOString().split("T")[0],
        signups: 0,
        matches: 0,
        wishlists: 0,
      };
    });

    users.forEach((user) => {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      const day = last7Days.find((d) => d.date === dateStr);
      if (day) day.signups++;
      if (user.matchedSantaId) {
        const matchDay = last7Days.find((d) => d.date === dateStr);
        if (matchDay) matchDay.matches++;
      }
    });

    wishlists.forEach((w) => {
      if (!w.items.length) return;
      const randomRecentDate =
        w.updatedAt?.toISOString().split("T")[0] ||
        w.createdAt?.toISOString().split("T")[0];
      const day = last7Days.find((d) => d.date === randomRecentDate);
      if (day) day.wishlists++;
    });

    const summary = {
      totalSignups: users.length,
      totalMatches: users.filter((u) => u.matchedSantaId).length,
      totalWishlists: wishlists.filter((w) => w.items.length).length,
    };

    res.status(200).json({ activity: last7Days, summary });
  } catch (error) {
    console.error("❌ Error building activity data:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
}
