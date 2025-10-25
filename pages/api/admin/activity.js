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
    // === Fetch users and wishlists ===
    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          createdAt: true,
          matchedSantaId: true,
        },
      }),
      prisma.wishlist.findMany({
        select: {
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          items: { select: { id: true } },
        },
      }),
    ]);

    const today = new Date();

    // === Initialize 14 days of data ===
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i));
      return {
        date: d.toISOString().split("T")[0],
        signups: 0,
        matches: 0,
        wishlists: 0,
      };
    });

    // === Aggregate signups per day ===
    users.forEach((user) => {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      const day = last14Days.find((d) => d.date === dateStr);
      if (day) day.signups += 1;
      if (user.matchedSantaId) {
        const matchDay = last14Days.find((d) => d.date === dateStr);
        if (matchDay) matchDay.matches += 1;
      }
    });

    // === Aggregate wishlist creations/updates per day ===
    wishlists.forEach((w) => {
      if (!w.items.length) return;
      const activityDate =
        w.updatedAt?.toISOString().split("T")[0] ||
        w.createdAt?.toISOString().split("T")[0];
      const day = last14Days.find((d) => d.date === activityDate);
      if (day) day.wishlists += 1;
    });

    // === Compute totals for summary section ===
    const totalSignups = users.length;
    const totalMatches = users.filter((u) => u.matchedSantaId).length;
    const totalWishlists = wishlists.filter((w) => w.items.length > 0).length;

    const summary = {
      totalSignups,
      totalMatches,
      totalWishlists,
    };

    return res.status(200).json({
      activity: last14Days,
      summary,
    });
  } catch (error) {
    console.error("❌ Error building activity data:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
}
