import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Extract email from the request body
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Find the user by email and include wishlist
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          wishlist: {
            include: {
              items: true, // Include wishlist items (adjust this based on your schema)
            },
          },
        },
      });

      return res.status(200).json(user);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error fetching matchedSanta's wishlist:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If the method is not POST, return a 405 Method Not Allowed response
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
