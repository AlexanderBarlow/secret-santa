import prisma from "../../lib/prisma";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			console.log("Seeding database...");

			// Check if the user already exists
			const existingUser = await prisma.user.findUnique({
				where: { email: "admin@domain.com" },
			});

			if (!existingUser) {
				await prisma.user.create({
					data: {
						email: "admin@domain.com",
						password: "adminpassword",
						isAdmin: true,
					},
				});
			} else {
				console.log("Admin user already exists, skipping creation.");
			}

			res.status(200).json({ message: "Seeding successful" });
		} catch (error) {
			console.error("Seeding error: ", error);
			res.status(500).json({ error: "Seeding failed" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
