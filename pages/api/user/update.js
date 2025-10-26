import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const updateData = {};
    if (name && name.trim() !== "") updateData.email = name.trim(); // 'email' used as name field
    if (password && password.trim() !== "")
      updateData.password = password.trim();

    // ✅ Removed 'approved' from select
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        password: false,
        profilePicture: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: "Server error updating user" });
  }
}
