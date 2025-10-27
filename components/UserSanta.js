"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import AskQuestionModal from "./AskQuestionModal";

export default function UserSanta({
  matchedSanta,
  matchedSantaWishlist,
  t,
  userId, // <-- Pass current user's ID here
}) {
  const [activeItem, setActiveItem] = useState(null);

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

          <div className="flex flex-col items-center gap-2 mt-3">
            {matchedSantaWishlist.length > 0 ? (
              matchedSantaWishlist.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 w-full max-w-sm"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className="text-white/90 text-sm">
                    {i + 1}. {item.item}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
                    onClick={() => setActiveItem(item)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{t("Ask")}</span>
                  </motion.button>
                </motion.div>
              ))
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
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
