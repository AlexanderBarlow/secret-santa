"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Send } from "lucide-react";

export default function QuestionModal({ item, questions, onClose, fetchQuestions }) {
    const [replyText, setReplyText] = useState("");

    const handleReply = async (questionId) => {
        if (!replyText.trim()) return;
        try {
            await axios.post("/api/questions/answer", {
                questionId,
                answerText: replyText,
            });
            setReplyText("");
            fetchQuestions(); // refresh
        } catch (err) {
            console.error("Error replying:", err);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-md text-white"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">🎁 {item}</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </button>
                </div>

                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="mb-4 p-3 rounded-lg bg-white/10 border border-white/20"
                    >
                        <p className="text-sm text-pink-300">❓ {q.questionText}</p>

                        {q.answerText ? (
                            <div className="mt-2 text-green-400 text-sm">
                                💬 <strong>Reply:</strong> {q.answerText}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <textarea
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="w-full bg-white/20 border border-white/30 rounded-lg p-2 text-sm text-white placeholder-white/70"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReply(q.id)}
                                    className="mt-2 flex items-center justify-center gap-1 px-4 py-2 bg-sky-500/30 hover:bg-sky-500/50 rounded-full border border-white/30 mx-auto"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Reply
                                </motion.button>
                            </div>
                        )}
                    </div>
                ))}


                {questions.length === 0 && (
                    <p className="text-center text-white/60">No questions for this item 🎄</p>
                )}
            </motion.div>
        </motion.div>
    );
}
