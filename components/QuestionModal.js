"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Send, CheckCircle } from "lucide-react";

export default function QuestionModal({ item, questions, onClose, fetchQuestions }) {
    const [localQuestions, setLocalQuestions] = useState(questions);
    const [replyText, setReplyText] = useState("");
    const [activeReply, setActiveReply] = useState(null);
    const [sending, setSending] = useState(false);
    const [sentId, setSentId] = useState(null);

    const handleReply = async (questionId) => {
        if (!replyText.trim()) return;
        setSending(true);

        try {
            // ✅ Optimistic update
            setLocalQuestions((prev) =>
                prev.map((q) =>
                    q.id === questionId
                        ? { ...q, answerText: replyText.trim(), isAnswered: true }
                        : q
                )
            );

            await axios.post("/api/questions/answer", {
                questionId,
                answerText: replyText.trim(),
            });

            setSentId(questionId);
            setReplyText("");
            setActiveReply(null);

            // ✅ Fetch fresh data from DB to confirm
            if (fetchQuestions) await fetchQuestions();

            setTimeout(() => setSentId(null), 1500);
        } catch (err) {
            console.error("Error replying:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-md text-white overflow-y-auto max-h-[80vh]"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold break-words">🎁 {item}</h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                            <X className="w-5 h-5 text-white/70 hover:text-white" />
                        </button>
                    </div>

                    {/* Questions */}
                    {localQuestions.length > 0 ? (
                        localQuestions.map((q) => (
                            <motion.div
                                key={q.id}
                                className="mb-4 p-3 rounded-lg bg-white/10 border border-white/20"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                            >
                                <p className="text-sm text-pink-300 mb-1">❓ {q.questionText}</p>

                                {q.isAnswered || q.answerText ? (
                                    <p className="text-green-400 text-sm mt-1">
                                        💬 <strong>Reply:</strong> {q.answerText}
                                    </p>
                                ) : sentId === q.id ? (
                                    <p className="text-green-400 flex items-center gap-1 text-sm">
                                        <CheckCircle className="w-4 h-4" /> Reply sent!
                                    </p>
                                ) : activeReply === q.id ? (
                                    <>
                                        <textarea
                                            rows={2}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply..."
                                            className="w-full bg-white/20 border border-white/30 rounded-lg p-2 text-sm text-white placeholder-white/70 focus:ring-2 focus:ring-sky-400/40"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => {
                                                    setActiveReply(null);
                                                    setReplyText("");
                                                }}
                                                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleReply(q.id)}
                                                disabled={sending}
                                                className="px-3 py-1 text-sm bg-sky-500/30 hover:bg-sky-500/50 rounded-lg border border-white/30 disabled:opacity-50"
                                            >
                                                {sending ? "Sending..." : "Send Reply"}
                                            </motion.button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setActiveReply(q.id)}
                                        className="text-sm text-sky-300 hover:text-sky-200 mt-2"
                                    >
                                        Reply
                                    </button>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center text-white/60">No questions for this item 🎄</p>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
