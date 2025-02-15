import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { adminCode } = req.body;

		if (!adminCode) {
			return res.status(400).json({ error: "Admin code is required." });
		}

		try {
			// Upsert (Insert if not exists, otherwise update) admin code in AdminCode model
			const updatedAdminCode = await prisma.adminCode.upsert({
				where: { id: 1 }, // Assuming there's a single row for admin codes
				update: { code: adminCode },
				create: { id: 1, code: adminCode },
			});

			return res
				.status(200)
				.json({ message: "Admin code saved successfully." });
		} catch (error) {
			return res.status(500).json({ error: "Error saving admin code." });
		}
	} else if (req.method === "GET") {
		// Fetch the current admin code from the database
		try {
			const adminCode = await prisma.adminCode.findUnique({
				where: { id: 1 }, // Assuming only one admin code is stored
			});

			if (!adminCode) {
				return res.status(404).json({ error: "Admin code not found." });
			}

			return res.status(200).json({ adminCode: adminCode.code });
		} catch (error) {
			return res.status(500).json({ error: "Error fetching admin code." });
		}
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
