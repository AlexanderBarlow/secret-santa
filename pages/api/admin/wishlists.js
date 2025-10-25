import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // --- Authorization check ---
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
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // --- Fetch all wishlists and related items ---
  if (req.method === "GET") {
    try {
      const wishlists = await prisma.wishlist.findMany({
        include: {
          items: {
            select: {
              id: true,
              item: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              Accepted: true,
            },
          },
        },
      });

      // Transform for cleaner frontend consumption
      const formatted = wishlists.map((w) => ({
        userId: w.user.id,
        userEmail: w.user.email,
        role: w.user.role,
        accepted: w.user.Accepted,
        items: w.items.map((i) => ({
          id: i.id,
          item: i.item,
        })),
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      return res.status(500).json({ error: "Failed to fetch wishlists" });
    }
  }

  // --- Unsupported method ---
  return res.status(405).json({ error: "Method not allowed" });
}
