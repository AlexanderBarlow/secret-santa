import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Missing token" });
        }

        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // ✅ Make sure we’re fetching the right user
        const adminUser = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        console.log("Fetched adminUser:", adminUser);

        // ✅ Explicitly check for isAdmin === true
        if (!adminUser) {
            return res.status(403).json({ message: "Forbidden: user not found" });
        }

        if (adminUser.isAdmin !== true) {
            console.log("User not admin:", adminUser);
            return res.status(403).json({ message: "Forbidden: not admin" });
        }

        // ✅ Fetch all questions
        const questions = await prisma.question.findMany({
            include: {
                wishlistItem: true,
                asker: { select: { id: true, email: true } },
                receiver: { select: { id: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ questions });
    } catch (error) {
        console.error("Error fetching admin questions:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}
