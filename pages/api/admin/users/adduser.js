import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { email } = req.body;

		if (!email || typeof email !== "string") {
			return res.status(400).json({ error: "Invalid email address." });
		}

		try {
			// Generate a random password
			const password = nanoid(12);

			// Save the user with the generated password
			const newUser = await prisma.user.create({
				data: {
					email,
					password, // You may want to hash this password in a real app
				},
			});

			return res.status(201).json({ email: newUser.email, password, isAdmin: false });
		} catch (error) {
			console.error("Error creating user:", error);
			return res.status(500).json({ error: "Failed to create user." });
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
