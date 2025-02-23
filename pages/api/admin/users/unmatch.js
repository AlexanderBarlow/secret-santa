// /pages/api/admin/users/unmatch.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { giverId, receiverId } = req.body;

		try {
			// Unmatch the users
			await prisma.user.update({
				where: { id: giverId },
				data: {
					matchedSanta: { disconnect: true },
				},
			});

			await prisma.user.update({
				where: { id: receiverId },
				data: {
					matchedBy: { disconnect: true },
				},
			});

			return res
				.status(200)
				.json({ message: "Users have been unmatched successfully." });
		} catch (error) {
			console.error("Error unmatching users:", error);
			return res.status(500).json({ error: "Error unmatching users." });
		}
	} else {
		return res.status(405).json({ error: "Method Not Allowed" });
	}
}
