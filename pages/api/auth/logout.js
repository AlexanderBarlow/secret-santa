// pages/api/auth/logout.js
import { destroyCookie } from "nookies";

export default function handler(req, res) {
  // Check the HTTP method, make sure it's a POST request for logout
  if (req.method === "POST") {
    // Destroy the JWT cookie named 'token'
    destroyCookie({ res }, "token", { path: "/" });

    // Respond with success
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    // If method is not POST, return a method not allowed error
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
