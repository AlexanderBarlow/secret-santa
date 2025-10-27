"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Clock, Sparkles } from "lucide-react";

export default function UserSanta({
  matchedSanta,
  matchedSantaWishlist,
  eventDetails,
  t,
}) {
  const [countdown, setCountdown] = useState("");
  const [revealReady, setRevealReady] = useState(false);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);

  // 🕒 Countdown timer to reveal date
  useEffect(() => {
    if (!eventDetails?.matchSantaDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const revealDate = new Date(eventDetails.matchSantaDate);
      const diff = revealDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRevealReady(true);
        setCountdown("🎁 It’s time! Your Secret Santa has been revealed!");
        setShowRevealAnimation(true);
        setTimeout(() => setShowRevealAnimation(false), 6000); // stop after 6s
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDetails?.matchSantaDate]);

  const revealDate = eventDetails?.matchSantaDate
    ? new Date(eventDetails.matchSantaDate)
    : null;

  // ✨ Reveal Animation Overlay
  const RevealAnimation = () => (
    <AnimatePresence>
      {showRevealAnimation && (
        <motion.div
          key="reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 via-red-400/20 to-sky-400/20 backdrop-blur-sm"
          />
          <motion.div
            className="text-center z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Sparkles className="w-12 h-12 mx-auto text-yellow-300 animate-pulse" />
            <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
              🎉 The Reveal Is Here!
            </h2>
            <p className="text-lg text-white/90">
              Your Secret Santa has been revealed below!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      key="santa"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="relative w-11/12 max-w-md sm:max-w-2xl rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-emerald-400/5 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)] p-6 sm:p-10 text-center overflow-hidden"
    >
      {/* Magic overlay */}
      <RevealAnimation />

      {!revealReady ? (
        <>
          {/* Countdown Screen */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-3"
          >
            <Gift className="w-12 h-12 text-sky-300 animate-bounce" />
            <h2 className="text-2xl font-semibold text-white">
              {t("Your Secret Santa will be revealed soon!")}
            </h2>
            <p className="text-white/80 text-sm">
              Reveal Date:{" "}
              <span className="text-emerald-300 font-medium">
                {revealDate
                  ? revealDate.toLocaleDateString()
                  : t("No date set")}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-3 bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-sky-300" />
              <span className="text-sky-200 font-mono text-sm">{countdown}</span>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          {/* 🎅 Revealed Santa Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-emerald-300">
              🎁 Meet Your Secret Santa
            </h2>

            {matchedSanta ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-inner backdrop-blur-sm">
                <motion.img
                  src={
                    matchedSanta?.profilePicture || "/default-profile.png"
                  }
                  alt="Your Secret Santa"
                  className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-2 border-white/30 object-cover mb-3 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />
                <h3 className="text-xl font-semibold text-white">
                  {matchedSanta.email}
                </h3>

                <p className="text-white/70 text-sm mt-1">
                  {t("Here’s their wishlist")} 🎄
                </p>

                <ul className="mt-3 space-y-2 text-white/90 text-sm">
                  {matchedSantaWishlist?.length > 0 ? (
                    matchedSantaWishlist.map((item, i) => (
                      <li
                        key={i}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2"
                      >
                        {item.item}
                      </li>
                    ))
                  ) : (
                    <li className="text-white/60 italic">
                      {t("No wishlist items yet.")}
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-white/70">{t("No match assigned yet.")}</p>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
