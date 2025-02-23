// /pages/api/admin/users/selectmatch.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { giverId, receiverId } = req.body;

		try {
			// Ensure that the users are not already matched
			const giver = await prisma.user.findUnique({
				where: { id: giverId },
			});
			const receiver = await prisma.user.findUnique({
				where: { id: receiverId },
			});

			if (!giver || !receiver) {
				return res.status(404).json({ error: "Users not found." });
			}

			// Update both users with the new match
			await prisma.user.update({
				where: { id: giverId },
				data: {
					matchedSanta: { connect: { id: receiverId } },
				},
			});

			await prisma.user.update({
				where: { id: receiverId },
				data: {
					matchedBy: { connect: { id: giverId } },
				},
			});

			return res.status(200).json({ message: "Match selected successfully." });
		} catch (error) {
			console.error("Error selecting match:", error);
			return res.status(500).json({ error: "Error selecting match." });
		}
	} else {
		return res.status(405).json({ error: "Method Not Allowed" });
	}
}
