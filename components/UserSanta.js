"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Lock, Unlock } from "lucide-react";
import axios from "axios";
import AskQuestionModal from "./AskQuestionModal";

export default function UserSanta({
  matchedSanta,
  matchedSantaWishlist,
  eventDetails,
  t,
  userId,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [serverDate, setServerDate] = useState(null);
  const [revealDate, setRevealDate] = useState(null);

  /* 🧭 Verify reveal time with server */
  useEffect(() => {
    const verifyReveal = async () => {
      try {
        const res = await axios.get("/api/event/checkReveal");
        const { nowUTC, matchSantaDateUTC } = res.data;

        const now = new Date(nowUTC);
        const reveal = new Date(matchSantaDateUTC);

        setServerDate(now);
        setRevealDate(reveal);

        const hasPlayed = localStorage.getItem("santaRevealed");

        // If already revealed before
        if (hasPlayed === "true") {
          setIsRevealed(true);
          return;
        }

        // Check if server time is after or equal to reveal date
        if (now >= reveal) {
          console.log("🎁 Server says it's reveal time!");
          setShowAnimation(true);
          setTimeout(() => {
            setIsRevealed(true);
            localStorage.setItem("santaRevealed", "true");
          }, 1500);
        } else {
          setIsRevealed(false);
          localStorage.removeItem("santaRevealed");
        }
      } catch (err) {
        console.error("Error verifying reveal date:", err);
      }
    };

    verifyReveal();

    // Recheck every minute to automatically unlock if time passes
    const interval = setInterval(verifyReveal, 60000);
    return () => clearInterval(interval);
  }, []);

  /* 💬 Fetch questions */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/questions/get?userId=${userId}&type=sent`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch((err) => console.error("Error fetching Santa questions:", err));
  }, [userId]);

  /* Filter questions per wishlist item */
  const getItemQuestions = (itemId) =>
    questions.filter((q) => q.wishlistItemId === itemId);

  /* ✨ Sparkle Unlock Animation */
  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [1, 1.3, 1],
      transition: { duration: 1.8, ease: "easeInOut" },
    },
  };

  const isLocked = !isRevealed;

  return (
    <motion.div
      key="santa"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-11/12 max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-sky-400/10 
                 backdrop-blur-xl border border-white/30 p-6 sm:p-10 text-center overflow-hidden"
    >
      {/* 🔒 Locked Overlay */}
      {!isRevealed && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center 
                        backdrop-blur-2xl bg-black/40 rounded-3xl border border-white/20 transition-all duration-700"
        >
          <Lock className="w-10 h-10 text-white/80 animate-pulse mb-3" />
          <p className="text-white/90 font-semibold mb-1">
            {t("Your Santa is hidden!")}
          </p>
          <p className="text-xs text-white/60">
            {revealDate
              ? `🎁 Reveals on ${revealDate.toLocaleDateString()}`
              : "Match date not set"}
          </p>
        </div>
      )}

      {/* ✨ Magical Unlock Animation (once only) */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            key="sparkle"
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-br 
                       from-yellow-200/10 via-white/20 to-transparent rounded-3xl pointer-events-none"
            onAnimationComplete={() => setShowAnimation(false)}
          >
            <Unlock className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎅 Main Santa Content */}
      <motion.div
        className={`transition-all duration-700 ${
          isLocked ? "blur-md scale-[0.98]" : "blur-none scale-100"
        }`}
      >
        {matchedSanta ? (
          <>
            <img
              src={matchedSanta?.profilePicture || "/santa.png"}
              alt="Santa"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover shadow-lg"
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

                      {/* Q&A Thread */}
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
                                <p className="text-pink-300">
                                  ❓ {q.questionText}
                                </p>
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
      </motion.div>

      {/* 💬 Ask Question Modal */}
      <AnimatePresence>
        {activeItem && (
          <AskQuestionModal
            item={activeItem}
            receiverId={matchedSanta.id}
            askerId={userId}
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
