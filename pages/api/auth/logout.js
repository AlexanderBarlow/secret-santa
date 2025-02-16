// pages/api/auth/logout.js
import { destroyCookie } from "nookies";

export default function handler(req, res) {
<<<<<<< HEAD
  // Check the HTTP method, make sure it's a POST request for logout
  if (req.method === "POST") {
    // Destroy the JWT cookie named 'token'
    destroyCookie({ res }, "token", { path: "/" });
=======
	// Check the HTTP method, make sure it's a POST request for logout
	if (req.method === "POST") {
		// Destroy the JWT cookie named 'token'
		destroyCookie({ res }, "token", { path: "/" });
>>>>>>> 5110d62d319d6cf6e1aeec29b4c099a2ebbf9b7e

    // Respond with success
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    // If method is not POST, return a method not allowed error
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
