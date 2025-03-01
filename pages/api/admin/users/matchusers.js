import { matchHelper } from "../../../../lib/auth";
import { matchUsers } from "../../../../utils/matchusers";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Fetch users from your database
      const users = await matchHelper();
      console.log("Fetched users:", users); // Log fetched users

      if (users.length < 2) {
        return res.status(400).json({ error: "Not enough users to match." });
      }

      // Match users
      const matches = matchUsers(users);
      console.log("Matched users:", matches); // Log the generated matches

      if (!matches || matches.length === 0) {
        return res.status(500).json({ error: "Error generating matches." });
      }

      // Save the matches to the database
      for (const match of matches) {
        // Updating giver user
        const giver = await prisma.user.update({
          where: { id: match.giverId },
          data: { matchedSanta: { connect: { id: match.receiverId } } },
        });

        // Updating receiver user
        const receiver = await prisma.user.update({
          where: { id: match.receiverId },
          data: { matchedBy: { connect: { id: match.giverId } } },
        });
      }

      return res.status(200).json({
        message: "Users matched successfully",
        matches: matches, // Send the matched users
      });
    } catch (error) {
      console.error("Error during matching:", error); // Detailed error logging
      return res.status(500).json({ error: "Error matching users" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
