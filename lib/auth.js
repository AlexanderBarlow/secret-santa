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

// Fetch all users from the database
export async function getUsers() {
	try {
		const users = await prisma.user.findMany(); // Fetch users from DB
		return users; // Return empty array if no users are found
	} catch (error) {
		console.error("Error fetching users:", error); // Log the error for debugging
		return []; // Return empty array on error or empty database
	} finally {
		await prisma.$disconnect(); // Disconnect from DB after query
	}
}

// Fetch dashboard stats
export async function getDashboardStats() {
	try {
		// Example: Get total number of users
		const totalUsers = await prisma.user.count();

		// Example: Get number of active users (users who logged in within the last 30 days)
		const activeUsers = await prisma.user.count({
			where: {
				lastLogin: {
					gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Users logged in within the last 30 days
				},
			},
		});

		// Example: Get total number of orders (replace with your actual model if you have an 'orders' table)
		const totalOrders = await prisma.order.count();

		console.log("Dashboard Stats:", { totalUsers, activeUsers, totalOrders });

		// Return stats as an object
		return {
			totalUsers,
			activeUsers,
			totalOrders,
		};
	} catch (error) {
		console.error("Error fetching dashboard stats:", error); // Log the error for debugging
		return null; // Return null if there's an error fetching stats
	} finally {
		await prisma.$disconnect(); // Ensure proper disconnection from DB
	}
}

