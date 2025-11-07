import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { wishlist } = req.body;

      if (!Array.isArray(wishlist) || wishlist.length === 0) {
        return res.status(400).json({ error: "Invalid wishlist data." });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authentication token is required." });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Invalid token payload." });
      }

      // 🔍 Find existing wishlist
      const existingWishlist = await prisma.wishlist.findUnique({
        where: { userId: decoded.id },
        include: { items: true },
      });

      let updatedWishlist;

      if (existingWishlist) {
        // ✅ Delete existing items (cascade will delete related questions automatically)
        await prisma.wishlistItem.deleteMany({
          where: { wishlistId: existingWishlist.id },
        });

        // ✅ Create new wishlist items
        updatedWishlist = await prisma.wishlist.update({
          where: { id: existingWishlist.id },
          data: {
            items: {
              create: wishlist.map((item) => ({ item })),
            },
          },
          include: { items: true },
        });
      } else {
        // ✅ Create new wishlist if none exists
        updatedWishlist = await prisma.wishlist.create({
          data: {
            userId: decoded.id,
            items: {
              create: wishlist.map((item) => ({ item })),
            },
          },
          include: { items: true },
        });
      }

      return res.status(200).json({
        message: "Wishlist updated successfully.",
        wishlist: updatedWishlist,
      });
    } catch (error) {
      console.error("❌ Error updating wishlist:", error);
      return res.status(500).json({ error: "Failed to update wishlist." });
    }
  }

  // 🟦 GET: fetch user's wishlist
  else if (req.method === "GET") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authentication token is required." });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Invalid token payload." });
      }

      const userWishlist = await prisma.wishlist.findUnique({
        where: { userId: decoded.id },
        include: { items: true },
      });

      if (!userWishlist) {
        return res.status(200).json({ wishlist: [] });
      }

      return res.status(200).json({
        wishlist: userWishlist.items.map((item) => item.item),
      });
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      return res.status(500).json({ error: "Failed to fetch wishlist." });
    }
  }

  // 🟥 Unsupported method
  else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
