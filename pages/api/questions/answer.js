import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { questionId, answerText } = req.body;

        if (!questionId || !answerText?.trim()) {
            return res.status(400).json({ message: "Missing questionId or answerText" });
        }

        const updated = await prisma.question.update({
            where: { id: Number(questionId) },
            data: {
                answerText,
                isAnswered: true,
            },
        });

        return res.status(200).json({ message: "Answer saved!", question: updated });
    } catch (error) {
        console.error("Error answering question:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
