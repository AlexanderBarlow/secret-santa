// /pages/api/event/checkReveal.js
import prisma from "../../../lib/prisma"; // adjust path if needed

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ Use AdminCode model since your schema defines it
    const adminCode = await prisma.adminCode.findFirst({
      select: {
        matchSantaDate: true,
        eventDate: true,
        overview: true,
        code: true,
      },
    });

    if (!adminCode) {
      console.error("❌ No AdminCode record found in database");
      return res.status(404).json({ error: "No AdminCode record found" });
    }

    if (!adminCode.matchSantaDate) {
      console.error("⚠️ AdminCode missing matchSantaDate:", adminCode);
      return res.status(404).json({ error: "Match Santa date not set" });
    }

    const nowUTC = new Date().toISOString();

    return res.status(200).json({
      nowUTC,
      matchSantaDateUTC: adminCode.matchSantaDate.toISOString(),
      eventDateUTC: adminCode.eventDate
        ? adminCode.eventDate.toISOString()
        : null,
      overview: adminCode.overview || null,
      code: adminCode.code,
    });
  } catch (err) {
    console.error("🔥 checkReveal API failed:", err);
    res.status(500).json({ error: err.message });
  }
}
