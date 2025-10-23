import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	const { matches } = req.body;

	if (!matches || !Array.isArray(matches) || matches.length === 0) {
		return res.status(400).json({ error: "No matches provided." });
	}

	try {
		console.log(`Saving ${matches.length} matches...`);

		// Step 1: Clear all matches first (outside the transaction)
		await prisma.user.updateMany({
			data: { matchedSantaId: null },
		});

		// Step 2: Build an array of update promises for parallel execution
		const updates = matches.flatMap(({ giverId, receiverId }) => {
			if (!giverId || !receiverId || giverId === receiverId) return [];

			return [
				prisma.user.update({
					where: { id: giverId },
					data: { matchedSanta: { connect: { id: receiverId } } },
				}),
				prisma.user.update({
					where: { id: receiverId },
					data: { matchedBy: { connect: { id: giverId } } },
				}),
			];
		});

		// Step 3: Execute all updates in a single batched transaction
		await prisma.$transaction(updates, { timeout: 15000 }); // 15s timeout

		console.log("✅ Matches saved successfully!");
		return res.status(200).json({ message: "Matches saved successfully!" });
	} catch (error) {
		console.error("Error saving matches:", error);
		return res.status(500).json({ error: "Error saving matches." });
	}
}
