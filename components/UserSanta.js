"use client";

import { motion } from "framer-motion";
import { Calendar, Gift, Sparkles } from "lucide-react";

export default function UserSanta({ matchedSanta, matchedSantaWishlist = [], eventDetails, t }) {
  const matchDate = eventDetails?.matchSantaDate
    ? new Date(eventDetails.matchSantaDate).toLocaleDateString()
    : null;

  return (
    <motion.div
      key="santa"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-11/12 max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-sky-400/10 backdrop-blur-xl border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.2)] p-6 sm:p-10 text-center"
    >
      {/* 🎅 Match Date Section */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 backdrop-blur-sm shadow-inner">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-sky-300" />
          <h3 className="text-lg font-semibold text-sky-200">
            {t("Secret Santa Match Date")}
          </h3>
        </div>

        <p className="text-sm text-white/90 mb-2">
          {matchDate ? (
            <>
              🎄 <strong>{t("Your match will be revealed on")}:</strong>{" "}
              <span className="text-sky-200 font-medium">{matchDate}</span>
            </>
          ) : (
            <span className="italic text-white/70">
              {t("Match date not set yet.")}
            </span>
          )}
        </p>
      </div>

      {/* 🎁 Matched Santa Info */}
      {matchedSanta ? (
        <>
          <img
            src={matchedSanta?.profilePicture || "/santa.png"}
            alt="Santa"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
          />
          <h3 className="text-lg font-semibold mb-1">
            {matchedSanta.email}
          </h3>

          <h4 className="mt-4 text-md font-semibold flex items-center justify-center gap-2 text-sky-200">
            <Gift className="w-4 h-4" />
            {t("Their Wishlist")}
          </h4>

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {matchedSantaWishlist.length > 0 ? (
              matchedSantaWishlist.map((item, i) => (
                <span
                  key={i}
                  className="bg-sky-500/30 px-3 py-1.5 rounded-full text-sm border border-sky-300/40 text-white/90"
                >
                  {item.item}
                </span>
              ))
            ) : (
              <p className="opacity-70">{t("No Wishlist Yet!")}</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center mt-4 text-center">
          <Sparkles className="w-6 h-6 mb-2 text-yellow-300 animate-pulse" />
          <p className="text-white/80 max-w-xs leading-relaxed">
            {t(
              "You’ll meet your Secret Santa after the match date! Keep an eye out for surprises 🎁"
            )}
          </p>
        </div>
      )}
    </motion.div>
  );
}
