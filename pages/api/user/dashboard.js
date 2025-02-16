import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { parseCookies } from "nookies";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const cookies = parseCookies({ req });
    const token = cookies.token;

    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    try {
      // Verify the token and decode it
      const decoded = verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token:", decoded);

      // Ensure the decoded token is valid and contains the expected values
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Fetch user details from the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          isAdmin: true,
          wishList: true,
        },
      });

      // Handle case if user is not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User dashboard data fetched successfully",
        user,
      });
    } catch (error) {
      console.error("Error during request:", error);

      if (error instanceof SyntaxError) {
        res.status(400).json({ message: "Bad request, invalid token format" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
