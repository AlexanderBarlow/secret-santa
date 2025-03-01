import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req; // Extract method and id from the request

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    if (method === "DELETE") {
      // Step 1: Delete related WishlistItem entries first
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlist: {
            userId: parseInt(id), // Delete all wishlist items associated with the user's wishlist
          },
        },
      });

      // Step 2: Delete related Wishlist entries
      await prisma.wishlist.deleteMany({
        where: {
          userId: parseInt(id), // Delete all wishlists associated with the user
        },
      });

      // Step 3: Delete the user
      const result = await prisma.user.delete({
        where: {
          id: parseInt(id), // Assuming 'id' is an integer, you can adjust accordingly if it's a different type
        },
      });

      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User removed successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error removing user:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove user. Please try again later." });
  }
}
