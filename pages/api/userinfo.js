import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorization.split(" ")[1]; // Extract the token

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // Retrieve the user from the database using the decoded ID (adjust field name as needed)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }, // Assuming the decoded token contains `id`
      include: {
        matchedSanta: true, // Include matched Santa information
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user data along with the matchedSanta
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
