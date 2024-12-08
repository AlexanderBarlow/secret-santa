// /pages/api/admin/stats.js
import { getDashboardStats } from "../../../lib/auth"; // Import the getDashboardStats function

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const stats = await getDashboardStats(); // Fetch the dashboard stats

			if (!stats) {
				return res.status(200).json({ message: "No stats available" });
			}

			res.status(200).json(stats); // Return stats as a response
		} catch (error) {
			console.error("Error fetching stats:", error); // Log the error for debugging
			res.status(500).json({ error: "Failed to fetch stats" }); // Return error if fetching fails
		}
	} else {
		res.status(405).json({ error: "Method not allowed" }); // If method is not GET, respond with method not allowed
	}
}
