import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { adminCode, eventDate, matchSantaDate, overview } = req.body;

		// Validate required fields
		if (!adminCode || !eventDate || !matchSantaDate || !overview) {
			return res.status(400).json({ error: "All fields are required." });
		}

		try {
			// Upsert admin code with the new fields
			const updatedAdminCode = await prisma.adminCode.upsert({
				where: { id: 1 },
				update: {
					code: adminCode,
					eventDate: new Date(eventDate), // Ensure it's a Date object
					matchSantaDate: new Date(matchSantaDate),
					overview,
				},
				create: {
					id: 1,
					code: adminCode,
					eventDate: new Date(eventDate),
					matchSantaDate: new Date(matchSantaDate),
					overview,
				},
			});


			return res
				.status(200)
				.json({
					message: "Admin details saved successfully.",
					adminCode: updatedAdminCode,
				});
		} catch (error) {
			return res.status(500).json({ error: "Error saving admin details." });
		}
	} else if (req.method === "GET") {
		// Fetch the current admin code and event details from the database
		try {
			const adminCode = await prisma.adminCode.findUnique({
				where: { id: 1 },
			});

			if (!adminCode) {
				return res.status(404).json({ error: "Admin details not found." });
			}

			return res.status(200).json(adminCode);
		} catch (error) {
			return res.status(500).json({ error: "Error fetching admin details." });
		}
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
