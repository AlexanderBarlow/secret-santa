// pages/api/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Your seed logic
			console.log("Seeding database...");
			// Example seed
			await prisma.user.create({
				data: {
					name: "Admin User",
					email: "admin@domain.com",
					password: "adminpassword",
				},
			});
			res.status(200).json({ message: "Seeding successful" });
		} catch (error) {
			console.error("Seeding error: ", error);
			res.status(500).json({ error: "Seeding failed" });
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
