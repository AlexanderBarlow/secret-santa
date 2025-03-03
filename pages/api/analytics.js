import prisma from "../../lib/prisma";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Fetch analytics data for users where isAdmin is false
		const totalUsers = await prisma.user.count({
			where: { isAdmin: false },
		});

		const acceptedUsers = await prisma.user.count({
			where: { Accepted: true, isAdmin: false },
		});

		const usersWithWishlists = await prisma.wishlist.count({
			where: {
				user: { isAdmin: false },
			},
		});

		const usersWithItems = await prisma.wishlist.count({
			where: {
				user: { isAdmin: false },
				items: { some: {} },
			},
		});

		// Return the analytics data
		res.status(200).json({
			totalUsers,
			acceptedUsers,
			usersWithWishlists,
			usersWithItems,
		});
	} catch (error) {
		console.error("Error fetching analytics data:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
