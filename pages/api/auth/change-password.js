import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		// Extract token from headers
		const { authorization } = req.headers;
		console.log("Authorization header:", authorization); // Log the incoming token

		if (!authorization || !authorization.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized. No token provided." });
		}

		const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"


		let decoded;
		try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token." });
		}

		// Extract passwords from request body
		const { currentPassword, newPassword } = req.body;
		if (!currentPassword || !newPassword) {
			return res.status(400).json({ message: "All fields are required." });
		}

		if (newPassword.length < 8) {
			return res
				.status(400)
				.json({ message: "Password must be at least 8 characters long." });
		}

		// Fetch the user from the database
		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Verify current password (assuming passwords are stored in plain text)
		if (user.password !== currentPassword) {
			return res
				.status(400)
				.json({ message: "Current password is incorrect." });
		}

		// Update password
		await prisma.user.update({
			where: { id: decoded.id },
			data: {
				password: newPassword,
				updatedPassword: true, // Change updatedPassword to true
			},
		});


		res.status(200).json({ message: "Password changed successfully." });
	} catch (error) {
		console.error("Error changing password:", error);
		res.status(500).json({ message: "Internal server error." });
	} finally {
		await prisma.$disconnect();
	}
}
