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

    // Fetch all accepted users
    const users = await prisma.user.findMany({
      where: { Accepted: true },
    });

    // Separate by role
    const frontUsers = users.filter((u) => u.role === "FRONT_OF_HOUSE");
    const backUsers = users.filter((u) => u.role === "BACK_OF_HOUSE");

    // Simple shuffle helper
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    const pairUsers = async (list) => {
      const shuffled = shuffle([...list]);
      for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length]; // next person in circle

        await prisma.user.update({
          where: { id: giver.id },
          data: { matchedSantaId: receiver.id },
        });
      }
    };

    // Pair FOH and BOH separately
    if (frontUsers.length > 1) await pairUsers(frontUsers);
    if (backUsers.length > 1) await pairUsers(backUsers);

    return res
      .status(200)
      .json({ message: "🎁 Matches generated successfully!" });
  } catch (error) {
    console.error("Error generating matches:", error);
    return res.status(500).json({ error: "❌ Failed to generate matches." });
  }
}
