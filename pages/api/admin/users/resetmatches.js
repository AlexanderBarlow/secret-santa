import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.user.updateMany({
      data: {
        matchedSantaId: null,
      },
    });

    return res
      .status(200)
      .json({ message: "🎁 All matches have been cleared!" });
  } catch (error) {
    console.error("Error resetting matches:", error);
    return res.status(500).json({ error: "❌ Failed to reset matches." });
  }
}
