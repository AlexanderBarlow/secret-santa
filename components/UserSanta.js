"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

export default function UserSanta({ matchedSanta, matchedSantaWishlist, eventDetails, t }) {
  const [reveal, setReveal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!eventDetails?.matchSantaDate) return;

    const today = new Date();
    const revealDate = new Date(eventDetails.matchSantaDate);
    const revealPlayed = localStorage.getItem("santaRevealPlayed");

    // 🎬 Trigger animation only if it's the reveal date or after,
    // and it hasn't been played yet
    if (today >= revealDate && !revealPlayed) {
      setShowAnimation(true);

      // After animation completes
      setTimeout(() => {
        setShowAnimation(false);
        setReveal(true);
        localStorage.setItem("santaRevealPlayed", "true"); // ✅ Save flag
      }, 8000);
    } else if (today >= revealDate) {
      // Already revealed or animation played before
      setReveal(true);
    }
  }, [eventDetails?.matchSantaDate]);

  return (
    <motion.div
      key="santa"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-11/12 max-w-md mx-auto rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-red-400/5 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)] p-6 sm:p-10 text-center relative overflow-hidden"
    >
      {/* 🎁 Fullscreen Reveal Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1437] via-[#1b2d55] to-[#0b1437] overflow-hidden"
          >
            {/* Gift Box */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: [0.8, 1.2, 1],
                rotate: [0, 8, -8, 0],
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 25px rgba(255,255,255,0.6)",
                  "0 0 40px rgba(255,255,255,0.8)",
                ],
              }}
              transition={{ duration: 2, repeat: 2 }}
              className="bg-gradient-to-tr from-red-500 via-yellow-300 to-green-400 rounded-2xl w-48 h-48 flex items-center justify-center border-4 border-white/30 shadow-[0_0_70px_rgba(255,255,255,0.4)]"
            >
              <Gift className="w-20 h-20 text-white animate-pulse" />
            </motion.div>

            {/* Reveal Text */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="text-3xl sm:text-4xl font-bold text-white mt-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
            >
              {t("Your Secret Santa Is...")}
            </motion.h2>

            {/* Sparkle Explosion */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, delay: 2 }}
            >
              {[...Array(40)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute text-yellow-200 opacity-80"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${0.8 + Math.random() * 1.8})`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎅 Santa Info */}
      {reveal ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-2">{t("Your Secret Santa 🎅")}</h2>
          <p className="text-white/90 text-sm mb-4">
            {matchedSanta || t("Santa not assigned yet.")}
          </p>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <h3 className="text-emerald-300 text-lg font-semibold mb-2">
              {t("Their Wishlist")}
            </h3>
            {matchedSantaWishlist?.length > 0 ? (
              <ul className="space-y-2 text-sm text-white/80">
                {matchedSantaWishlist.map((item, i) => (
                  <li key={i} className="border-b border-white/10 pb-1">
                    🎁 {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60">{t("No wishlist available yet.")}</p>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center text-center mt-10">
          <Gift className="w-12 h-12 text-red-300 mb-3 animate-bounce" />
          <p className="text-sm text-white/70 italic">
            {t("Your match will be revealed soon! Check back on the event date.")}
          </p>
        </div>
      )}

      {/* Float Animation for Sparkles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </motion.div>
  );
}
