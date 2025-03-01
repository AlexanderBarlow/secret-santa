import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Request Body:", req.body); // Debugging the request body

    // Ensure both giverId and receiverId are numbers
    const giverId = Number(req.body.giverId);
    const receiverId = Number(req.body.receiverId);

    // Validate the IDs
    if (isNaN(giverId) || isNaN(receiverId)) {
      return res.status(400).json({ message: "Invalid giver or receiver ID." });
    }

    // Check if giver and receiver are the same person
    if (giverId === receiverId) {
      console.log("Giver and receiver are the same. Returning error.");
      return res
        .status(400)
        .json({ message: "Giver and receiver cannot be the same person." });
    }

    try {
      const giver = await prisma.user.findUnique({
        where: { id: giverId },
      });

      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });

      // If either giver or receiver is not found
      if (!giver || !receiver) {
        return res
          .status(404)
          .json({ message: "Giver or receiver not found." });
      }

      // Update the giver and receiver match relationships
      const updatedGiver = await prisma.user.update({
        where: { id: giverId },
        data: {
          matchedSanta: { connect: { id: receiverId } },
        },
      });

      await prisma.user.update({
        where: { id: receiverId },
        data: {
          matchedBy: { connect: { id: giverId } },
        },
      });

      return res
        .status(200)
        .json({ message: "Receiver has been assigned successfully." });
    } catch (error) {
      console.error("Error assigning receiver:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while assigning the receiver." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
