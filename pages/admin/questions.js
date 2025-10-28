"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Gift,
    MessageCircle,
    User,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/admin/questions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuestions(res.data.questions || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b1437] via-[#1a2e5c] to-[#2e4372] text-white py-8 px-4 sm:px-8 relative overflow-hidden">
            {/* Frosted Container */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
                <div className="flex items-center justify-center mb-6">
                    <ShieldCheck className="w-7 h-7 text-emerald-300 mr-2" />
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-sky-300 to-pink-300 bg-clip-text text-transparent">
                        Admin Q&A Overview
                    </h1>
                </div>

                {loading ? (
                    <p className="text-center text-white/70">Loading questions...</p>
                ) : error ? (
                    <p className="text-red-400 text-center">{error}</p>
                ) : questions.length === 0 ? (
                    <p className="text-white/80 text-center">No questions found 🎅</p>
                ) : (
                    <div className="space-y-4 sm:space-y-5">
                        <AnimatePresence>
                            {questions.map((q) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-lg shadow-inner hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-sm text-emerald-300">
                                            <Gift className="w-4 h-4" />
                                            <span className="font-medium">
                                                {q.wishlistItem?.item || "Unknown Item"}
                                            </span>
                                        </div>

                                        {q.answerText ? (
                                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                                <CheckCircle className="w-4 h-4" />
                                                Answered
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                <Clock className="w-4 h-4" />
                                                Awaiting reply
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm sm:text-base text-pink-300 mt-2">
                                        <MessageCircle className="inline w-4 h-4 mr-1 text-pink-300" />
                                        <strong>Question:</strong> {q.questionText}
                                    </p>

                                    {q.answerText && (
                                        <p className="text-sm sm:text-base text-green-300 mt-2">
                                            💬 <strong>Answer:</strong> {q.answerText}
                                        </p>
                                    )}

                                    <div className="mt-4 border-t border-white/10 pt-3 text-xs sm:text-sm text-white/70">
                                        <p className="flex items-center gap-1">
                                            <User className="w-4 h-4 text-sky-300" />{" "}
                                            <strong>Asker:</strong> {q.asker?.email || "Unknown"}
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <User className="w-4 h-4 text-red-300" />{" "}
                                            <strong>Receiver:</strong> {q.receiver?.email || "Unknown"}
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-emerald-300" />{" "}
                                            {new Date(q.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
            <AdminNavbar />
        </div>
    );
}
