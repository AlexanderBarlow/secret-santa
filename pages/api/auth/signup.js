import { parseCookies } from "nookies";
import jwt from "jsonwebtoken"; // For generating JWT token
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { email, adminCode, password } = req.body;

	// Step 1: Validate the provided adminCode
	const storedAdminCode = await prisma.adminCode.findUnique({
		where: { code: adminCode },
	});

	if (!storedAdminCode) {
		return res.status(400).json({ error: "Invalid admin code." });
	}

	// Step 2: Check if the email already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		return res.status(400).json({ error: "Email already registered." });
	}

	try {
		// Step 3: Create the new user in the database with plain text password (not recommended for production)
		const newUser = await prisma.user.create({
			data: {
				email,
				password, // Store the password as it is (in plain text)
				updatedPassword: false, // Assuming the user will change the password after signup
			},
		});

		// Optionally, create a JWT token for the user after successful signup
		const token = jwt.sign(
			{
				id: newUser.id,
				email: newUser.email,
				isAdmin: newUser.isAdmin,
				changedPassword: newUser.changedPassword,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		// Send success response with the token
		return res
			.status(200)
			.json({ message: "User created successfully!", token });
	} catch (error) {
		console.error("Error creating user:", error);
		return res
			.status(500)
			.json({ error: "Server error. Please try again later." });
	}
}
