import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle wishlist update
    try {
      const { wishlist } = req.body;
      console.log(wishlist);

      // Validate wishlist to ensure it's an array and contains at least one item
      if (!Array.isArray(wishlist) || wishlist.length === 0) {
        return res.status(400).json({ error: "Invalid wishlist data." });
      }

      // Get the token from the request headers (assuming it's a Bearer token)
      const token = req.headers.authorization?.split(" ")[1]; // Correctly access the Authorization header

      if (!token) {
        return res
          .status(401)
          .json({ error: "Authentication token is required." });
      }

      // Decode the token and extract the user ID
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Ensure decoded is not null or undefined
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Invalid token payload." });
      }

      // Check if the user has an existing wishlist
      let updatedWishlist;
      const existingWishlist = await prisma.wishlist.findUnique({
        where: { userId: decoded.id }, // Find the wishlist for this user
      });

      if (existingWishlist) {
        // Update the existing wishlist by removing old items and adding new ones
        updatedWishlist = await prisma.wishlist.update({
          where: { userId: decoded.id },
          data: {
            items: {
              deleteMany: {}, // Remove all existing items
              create: wishlist.map((item) => ({ item })), // Add new items
            },
          },
        });
      } else {
        // Create a new wishlist for the user
        updatedWishlist = await prisma.wishlist.create({
          data: {
            userId: decoded.id,
            items: {
              create: wishlist.map((item) => ({ item })), // Add items to the new wishlist
            },
          },
        });
      }

      return res.status(200).json({
        message: "Wishlist updated successfully.",
        wishlist: updatedWishlist,
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      return res.status(500).json({ error: "Failed to update wishlist." });
    }
  } else if (req.method === "GET") {
    // Handle wishlist retrieval
    try {
      // Get the token from the request headers (assuming it's a Bearer token)
      const token = req.headers.authorization?.split(" ")[1]; // Correctly access the Authorization header

      if (!token) {
        return res
          .status(401)
          .json({ error: "Authentication token is required." });
      }

      // Decode the token and extract the user ID
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Ensure decoded is not null or undefined
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Invalid token payload." });
      }

      // Fetch the user's wishlist
      const userWishlist = await prisma.wishlist.findUnique({
        where: { userId: decoded.id },
        include: {
          items: true, // Include the items of the wishlist
        },
      });

      if (!userWishlist) {
        return res.status(200).json({ error: "Wishlist not found." });
      }

      // Return the user's wishlist items
      return res.status(200).json({
        wishlist: userWishlist.items.map((item) => item.item), // Only send the item names
      });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return res.status(500).json({ error: "Failed to fetch wishlist." });
    }
  } else {
    // If the request method is not POST or GET, return method not allowed
    return res.status(405).json({ error: "Method not allowed." });
  }
}
