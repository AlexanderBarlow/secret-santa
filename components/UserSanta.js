"use client";

import { motion } from "framer-motion";

export default function UserSanta({ matchedSanta, matchedSantaWishlist, t }) {
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

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {matchedSantaWishlist.length > 0 ? (
              matchedSantaWishlist.map((item, i) => (
                <span
                  key={i}
                  className="bg-sky-400/30 px-3 py-1.5 rounded-full text-sm"
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
        <p className="opacity-70">{t("No Match Yet")}</p>
      )}
    </motion.div>
  );
}
