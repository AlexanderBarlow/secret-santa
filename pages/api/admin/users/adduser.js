import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { adminCode, eventDate, matchSantaDate, overview } = req.body;

    try {
      // Fetch existing admin details
      let existingAdmin = await prisma.adminCode.findUnique({
        where: { id: 1 },
      });

      // Build update object dynamically (ignore empty values)
      const updateFields = {};
      if (adminCode) updateFields.code = adminCode;
      if (eventDate) updateFields.eventDate = new Date(eventDate);
      if (matchSantaDate)
        updateFields.matchSantaDate = new Date(matchSantaDate);
      if (overview) updateFields.overview = overview;

      // Prevent empty update
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No fields to update." });
      }

      let updatedAdmin;
      if (existingAdmin) {
        // If admin details exist, update them
        updatedAdmin = await prisma.adminCode.update({
          where: { id: 1 },
          data: updateFields,
        });
      } else {
        // If no existing admin details, create with required fields
        updatedAdmin = await prisma.adminCode.create({
          data: {
            id: 1, // Ensure it's the correct primary key
            code: adminCode || "DEFAULT_CODE", // Use provided or default value
            eventDate: eventDate ? new Date(eventDate) : new Date(),
            matchSantaDate: matchSantaDate
              ? new Date(matchSantaDate)
              : new Date(),
            overview: overview || "Default Overview",
          },
        });
      }

      return res.status(200).json({
        message: "Admin details updated successfully.",
        adminCode: updatedAdmin,
      });
    } catch (error) {
      console.error("Error updating admin details:", error);
      return res.status(500).json({ error: "Error updating admin details." });
    }
  } else if (req.method === "GET") {
    try {
      const adminCode = await prisma.adminCode.findUnique({
        where: { id: 1 },
      });

      if (!adminCode) {
        return res.status(404).json({ error: "Admin details not found." });
      }

      return res.status(200).json(adminCode);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching admin details." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
