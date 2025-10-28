"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, User, ChevronDown, ChevronUp } from "lucide-react";

export default function UserCard({ user, handleAcceptUser, openDeleteModal }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all p-6 flex flex-col justify-between text-white"
    >
      {/* Frost shimmer accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none" />

      {/* Profile */}
      <div className="flex flex-col items-center mb-4 z-10">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover"
        />
        <h3 className="text-lg font-semibold mt-3 text-center">
          {user.email}
        </h3>
      </div>

      {/* Role & Status */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm ${user.role === "FRONT_OF_HOUSE"
              ? "bg-red-500/20 text-red-300"
              : "bg-sky-500/20 text-sky-300"
            }`}
        >
          {user.role === "FRONT_OF_HOUSE" ? "Front of House" : "Back of House"}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm ${user.Accepted
              ? "bg-green-500/20 text-green-300"
              : "bg-yellow-500/20 text-yellow-300"
            }`}
        >
          {user.Accepted ? "Accepted" : "Pending"}
        </span>
      </div>

      {/* Matched Santa */}
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-white/80">🎅 Matched Santa</h4>
        <p className="text-sm font-medium text-white mt-1 break-words">
          {user.matchedSanta?.email || "N/A"}
        </p>
      </div>

      {/* Wishlist */}
      <div className="mt-3">
        <div
          onClick={() => setWishlistOpen(!wishlistOpen)}
          className="text-sm font-semibold text-white/80 cursor-pointer flex justify-between items-center hover:text-sky-300 transition-colors"
        >
          <span className="flex items-center gap-1">
            <Gift className="w-4 h-4 text-sky-300" />
            Wishlist
          </span>
          {wishlistOpen ? (
            <ChevronUp className="w-4 h-4 text-white/70" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/70" />
          )}
        </div>

        <AnimatePresence>
          {wishlistOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-3 text-sm max-h-36 overflow-auto shadow-inner text-white/90"
            >
              {user.wishlist?.items?.length > 0 ? (
                user.wishlist.items.map((item, index) => (
                  <li
                    key={index}
                    className="border-b border-white/10 py-1 last:border-none text-white/80"
                  >
                    {item.item}
                  </li>
                ))
              ) : (
                <li className="text-white/60">No items in wishlist.</li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {!user.Accepted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAcceptUser(user.id)}
            className="flex-1 py-2 bg-gradient-to-r from-green-400/40 to-emerald-500/40 hover:from-green-400/60 hover:to-emerald-500/60 border border-green-300/30 text-white font-semibold rounded-lg shadow-md backdrop-blur-md transition-all"
          >
            Accept
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openDeleteModal(user.id)}
          className={`py-2 ${user.Accepted ? "w-full" : "flex-1"
            } bg-gradient-to-r from-red-400/40 to-pink-500/40 hover:from-red-400/60 hover:to-pink-500/60 border border-red-300/30 text-white font-semibold rounded-lg shadow-md backdrop-blur-md transition-all`}
        >
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
}
