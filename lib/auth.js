import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

const prisma = new PrismaClient();

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Attach user data to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Fetch all users from the database
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false, // Exclude admin users
      },
      include: {
        wishlist: {
          include: {
            items: true, // Include wishlist items for each user's wishlist
          },
        },
        matchedSanta: true, // Include the matchedSanta relationship (users the current user is a giver to)
        matchedBy: true, // Include the matchedBy relationship (users the current user is a receiver from)
      },
    });

    return users; // Return users with their wishlists, wishlist items, and matched pairs
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array on error
  } finally {
    await prisma.$disconnect();
  }
}


export async function matchHelper() {
	try {
		// Fetch users from the database excluding the ones with isAdmin: true
		const users = await prisma.user.findMany({
			where: {
				isAdmin: false, // Exclude admins
			},
			select: { id: true, email: true }, // Select only the necessary fields
		});
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw new Error("Error fetching users.");
	}
}




// Fetch dashboard stats




