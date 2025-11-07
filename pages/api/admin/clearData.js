import prisma from "../../../lib/prisma"; // ✅ use your prisma client import

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { isAdmin } = req.body;
        if (!isAdmin) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // ✅ Use correct model names — Prisma is case-sensitive
        await prisma.Question.deleteMany({});
        await prisma.WishlistItem.deleteMany({});
        await prisma.Wishlist.deleteMany({});
        await prisma.AdminCode.deleteMany({});
        await prisma.User.deleteMany({
            where: { isAdmin: false },
        });

        return res
            .status(200)
            .json({ message: "All non-admin data cleared successfully." });
    } catch (error) {
        console.error("Error clearing database:", error);
        return res.status(500).json({ error: "Error clearing database." });
    }
}
