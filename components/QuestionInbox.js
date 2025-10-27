"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function QuestionInbox({ userId }) {
  const [questions, setQuestions] = useState([]);
  const [replying, setReplying] = useState({});

  const fetchQuestions = async () => {
    const { data } = await axios.get(
      `/api/questions/get?userId=${userId}&type=received`
    );
    setQuestions(data.questions);
  };

  const handleReply = async (q) => {
    if (!replying[q.id]?.trim()) return;
    await axios.post("/api/questions/answer", {
      questionId: q.id,
      answerText: replying[q.id],
    });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <motion.div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        🎁 Questions From Your Santa
      </h2>
      {questions.length === 0 && (
        <p className="text-gray-400">No questions yet!</p>
      )}
      {questions.map((q) => (
        <motion.div
          key={q.id}
          className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-white"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-pink-300 text-sm">About: {q.wishlistItem.item}</p>
          <p className="mt-1 font-semibold">❓ {q.questionText}</p>

          {q.isAnswered ? (
            <p className="mt-2 text-green-400">💬 {q.answerText}</p>
          ) : (
            <div className="mt-3">
              <textarea
                className="w-full p-2 bg-white/20 rounded-lg text-white placeholder-white/70"
                placeholder="Type your reply..."
                value={replying[q.id] || ""}
                onChange={(e) =>
                  setReplying({ ...replying, [q.id]: e.target.value })
                }
              />
              <button
                onClick={() => handleReply(q)}
                className="mt-2 px-4 py-2 bg-pink-500 rounded-xl"
              >
                Send Reply
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
