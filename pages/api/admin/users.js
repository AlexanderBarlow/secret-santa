import { getUsers } from "../../../lib/auth"; // Replace with actual DB fetching logic

// Use default export for the handler function
export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const users = await getUsers();
			if (!users || users.length === 0) {
				res.status(200).json({ message: "No users found" });
			} else {
				res.status(200).json(users);
			}

		} catch (error) {
			res.status(500).json({ error: "Failed to fetch users" });
		}
	}
}
