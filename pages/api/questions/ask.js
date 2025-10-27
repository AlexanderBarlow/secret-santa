import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { askerId, receiverId, wishlistItemId, questionText } = req.body;

  if (!askerId || !receiverId || !wishlistItemId || !questionText.trim()) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const question = await prisma.question.create({
      data: {
        askerId,
        receiverId,
        wishlistItemId,
        questionText,
      },
    });
    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
