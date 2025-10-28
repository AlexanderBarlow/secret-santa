"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import AskQuestionModal from "./AskQuestionModal";

export default function UserSanta({
  matchedSanta,
  matchedSantaWishlist,
  t,
  userId, // current user's ID
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Fetch all questions sent by this Santa
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/questions/get?userId=${userId}&type=sent`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch((err) => console.error("Error fetching Santa questions:", err));
  }, [userId]);

  // Helper: Get all questions for a specific wishlist item
  const getItemQuestions = (itemId) =>
    questions.filter((q) => q.wishlistItemId === itemId);

  return (
    <motion.div
      key="santa"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-11/12 max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-sky-400/10 backdrop-blur-xl border border-white/30 p-6 sm:p-10 text-center"
    >
      {matchedSanta ? (
        <>
          <img
            src={matchedSanta?.profilePicture || "/santa.png"}
            alt="Santa"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
          />

          <h3 className="text-lg font-semibold mb-1">{matchedSanta.email}</h3>

          <h4 className="mt-4 text-md font-semibold">
            🎁 {t("Their Wishlist")}
          </h4>

          <div className="flex flex-col items-center gap-3 mt-3">
            {matchedSantaWishlist.length > 0 ? (
              matchedSantaWishlist.map((item, i) => {
                const itemQuestions = getItemQuestions(item.id);
                const hasReplies = itemQuestions.some((q) => q.isAnswered);

                return (
                  <motion.div
                    key={item.id}
                    className="w-full max-w-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Wishlist Item Header */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/90 text-sm font-medium">
                        {i + 1}. {item.item}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveItem(item)}
                        className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {t("Ask")}
                        </span>
                      </motion.button>
                    </div>

                    {/* Conversation Thread */}
                    <AnimatePresence>
                      {itemQuestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="mt-2 text-left space-y-2"
                        >
                          {itemQuestions.map((q) => (
                            <div
                              key={q.id}
                              className="text-xs bg-white/5 border border-white/10 rounded-lg p-2"
                            >
                              <p className="text-pink-300">❓ {q.questionText}</p>
                              {q.isAnswered ? (
                                <p className="text-green-300 mt-1">
                                  💬 <strong>{t("Reply")}:</strong>{" "}
                                  {q.answerText}
                                </p>
                              ) : (
                                <p className="text-white/50 mt-1 italic">
                                  {t("Awaiting reply...")}
                                </p>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Small reply status */}
                    {hasReplies && (
                      <p className="mt-1 text-xs text-green-400 text-right">
                        💌 {t("Reply received")}
                      </p>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <p className="opacity-70">{t("No Wishlist Yet!")}</p>
            )}
          </div>
        </>
      ) : (
        <p className="opacity-70">{t("No Match Yet")}</p>
      )}

      {/* Ask Question Modal */}
      <AnimatePresence>
        {activeItem && (
          <AskQuestionModal
            item={activeItem}
            receiverId={matchedSanta.id} // recipient
            askerId={userId} // logged-in user
            onClose={() => setActiveItem(null)}
            onQuestionSent={() => {
              axios
                .get(`/api/questions/get?userId=${userId}&type=sent`)
                .then((res) => setQuestions(res.data.questions || []));
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
