import { getUsers } from "../../../lib/auth";

// Use default export for the handler function
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await getUsers();

      if (users.length === 0) {
        return res.status(200).json([], { message: "No users found" });
      }

      // Successfully fetch users
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    } 
  } else {
    // Handle other HTTP methods here (if needed)
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
