import { deleteUser } from "../../../lib/db"; // Replace with actual DB deletion logic

// Use default export for the handler function
export default async function handler(req, res) {
	const { id } = req.query;

	if (req.method === "DELETE") {
		try {
			await deleteUser(id); // Delete user from DB
			res.status(200).json({ message: "User deleted successfully" });
		} catch (error) {
			res.status(500).json({ error: "Failed to delete user" });
		}
	}
}
