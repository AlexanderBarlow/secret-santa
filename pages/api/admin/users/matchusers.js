import { getUsers } from "../../../../utils/db";
import { matchUsers } from "../../../../utils/matchusers";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Fetch users from your database (make sure you have a proper function for this)
			const users = await getUsers();

			if (users.length < 2) {
				return res.status(400).json({ error: "Not enough users to match." });
			}

			// Match users
			const matches = matchUsers(users);

			// Optionally save the matches to the database here, if necessary.

			return res.status(200).json({
				message: "Users matched successfully",
				matches: matches, // Send the actual matched users
			});
		} catch (error) {
			console.error("Error during matching:", error); // Log the error
			return res.status(500).json({ error: "Error matching users" });
		}
	} else {
		return res.status(405).json({ error: "Method Not Allowed" });
	}
}
