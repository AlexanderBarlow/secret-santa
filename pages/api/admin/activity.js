import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: "Forbidden" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    // last 7 days of activity
    const users = await prisma.user.findMany({
      select: { createdAt: true, matchedSantaId: true },
    });

    const wishlists = await prisma.wishlist.findMany({
      select: { updatedAt: true, items: true },
    });

    // build simple 7-day activity array
    const today = new Date();
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      return { date: dateStr, signup: 0, match: 0, wishlist: 0 };
    });

    users.forEach((u) => {
      const day = days.find((d) =>
        u.createdAt.toISOString().startsWith(d.date)
      );
      if (day) day.signup++;
      if (u.matchedSantaId) day.match++;
    });

    wishlists.forEach((w) => {
      const day = days.find((d) =>
        w.updatedAt.toISOString().startsWith(d.date)
      );
      if (day && w.items.length) day.wishlist++;
    });

    const summary = {
      totalSignups: users.length,
      totalMatches: users.filter((u) => u.matchedSantaId).length,
      totalWishlists: wishlists.filter((w) => w.items.length).length,
    };

    res.status(200).json({ activity: days, summary });
  } catch (error) {
    console.error("Error generating activity:", error);
    res.status(500).json({ error: "Failed to fetch activity data" });
  }
}
