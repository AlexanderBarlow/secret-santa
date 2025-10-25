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
    const [users, wishlists] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, createdAt: true, matchedSantaId: true },
      }),
      prisma.wishlist.findMany({
        include: { items: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const today = new Date();

    // Build last 14 days baseline
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i));
      return {
        date: d.toISOString().split("T")[0],
        signup: 0,
        match: 0,
        wishlist: 0,
      };
    });

    // Signups + matches
    for (const user of users) {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      const entry = last14Days.find((d) => d.date === dateStr);
      if (entry) {
        entry.signup += 1;
        if (user.matchedSantaId) entry.match += 1;
      }
    }

    // Wishlist creation/update — any wishlist counts as wishlist activity
    for (const w of wishlists) {
      const dateStr =
        w.updatedAt?.toISOString().split("T")[0] ||
        w.createdAt.toISOString().split("T")[0];
      const entry = last14Days.find((d) => d.date === dateStr);
      if (entry) entry.wishlist += 1;
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
