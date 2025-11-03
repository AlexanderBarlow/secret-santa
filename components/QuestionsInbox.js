"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function QuestionInbox({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [replies, setReplies] = useState({}); // track reply text

    const fetchQuestions = async () => {
        try {
            const { data } = await axios.get(
                `/api/questions/get?userId=${userId}&type=received`
            );
            setQuestions(data.questions || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const handleReply = async (q) => {
        if (!replies[q.id]?.trim()) return;
        try {
            await axios.post("/api/questions/answer", {
                questionId: q.id,
                answerText: replies[q.id],
            });
            setReplies((prev) => ({ ...prev, [q.id]: "" }));
            fetchQuestions();
        } catch (err) {
            console.error("Error sending reply:", err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-11/12 max-w-lg mx-auto mt-6 p-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-sky-400/10 border border-white/20 backdrop-blur-xl text-white"
        >
            <h2 className="text-xl font-semibold mb-4 text-center">
                💌 Questions from Your Secret Santa
            </h2>

            {questions.length === 0 && (
                <p className="text-center text-white/60">No questions yet 🎄</p>
            )}

            <div className="space-y-4">
                {questions.map((q) => (
                    <motion.div
                        key={q.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-2xl bg-white/10 border border-white/20"
                    >
                        <p className="text-sm text-sky-300">
                            🏷️ About: <span className="text-white">{q.wishlistItem.item}</span>
                        </p>
                        <p className="mt-2 text-white/90">❓ {q.questionText}</p>

                        {q.isAnswered ? (
                            <div className="mt-3 text-green-400">
                                💬 Your Reply: {q.answerText}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <textarea
                                    placeholder="Type your reply..."
                                    value={replies[q.id] || ""}
                                    onChange={(e) =>
                                        setReplies((prev) => ({ ...prev, [q.id]: e.target.value }))
                                    }
                                    className="w-full p-2 bg-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-sky-400/50 outline-none"
                                    rows={2}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReply(q)}
                                    className="mt-2 flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-sky-500/30 hover:bg-sky-500/50 transition border border-white/30 mx-auto"
                                >
                                    <Send className="w-4 h-4" />
                                    <span className="text-sm font-medium">Send Reply</span>
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
