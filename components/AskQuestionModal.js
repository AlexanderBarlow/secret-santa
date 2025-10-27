"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AskQuestionModal({
  item,
  receiverId,
  askerId,
  onClose,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await axios.post("/api/questions/ask", {
        askerId,
        receiverId,
        wishlistItemId: item.id,
        questionText: text,
      });
      setSent(true);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-2">
            Ask about: <span className="text-pink-300">{item.item}</span>
          </h2>
          {!sent ? (
            <>
              <textarea
                className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70"
                placeholder="Type your question..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-xl"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-pink-500 rounded-xl disabled:opacity-50"
                  onClick={handleSend}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-green-400 font-semibold">
              Question sent!
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
