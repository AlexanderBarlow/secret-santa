"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronDown, ChevronUp } from "lucide-react";

export default function UserCard({ user, handleAcceptUser, openDeleteModal }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl 
                 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] 
                 p-6 flex flex-col text-white transition-all"
    >
      {/* Frost overlay shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none" />

      {/* Profile */}
      <div className="flex flex-col items-center mb-5 relative z-10">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover"
        />
        <h3 className="text-lg font-semibold mt-3 text-center tracking-wide">
          {user.email}
        </h3>
      </div>

      {/* Role & Status */}
      <div className="flex justify-center gap-2 flex-wrap mb-5">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border border-white/20 
                      backdrop-blur-sm ${user.role === "FRONT_OF_HOUSE"
              ? "bg-rose-500/20 text-rose-300"
              : "bg-sky-500/20 text-sky-300"
            }`}
        >
          {user.role === "FRONT_OF_HOUSE" ? "Front of House" : "Back of House"}
        </span>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border border-white/20 
                      backdrop-blur-sm ${user.Accepted
              ? "bg-green-500/20 text-green-300"
              : "bg-amber-500/20 text-amber-300"
            }`}
        >
          {user.Accepted ? "Accepted" : "Pending"}
        </span>
      </div>

      {/* Matched Santa */}
      <div className="text-center mb-4 bg-white/5 backdrop-blur-md rounded-xl py-3 border border-white/10">
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          🎅 Matched Santa
        </h4>
        <p className="text-sm font-medium text-white mt-1 truncate px-2">
          {user.matchedSanta?.email || "N/A"}
        </p>
      </div>

      {/* Wishlist */}
      <div className="mt-2">
        <button
          onClick={() => setWishlistOpen(!wishlistOpen)}
          className="w-full text-sm font-semibold text-white/80 flex justify-between items-center 
                     hover:text-sky-300 transition-colors py-1"
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
        </button>

        <AnimatePresence>
          {wishlistOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 bg-white/10 backdrop-blur-md border border-white/10 
                         rounded-xl p-3 text-sm max-h-36 overflow-auto shadow-inner text-white/90"
            >
              {user.wishlist?.items?.length > 0 ? (
                user.wishlist.items.map((item, index) => (
                  <li
                    key={index}
                    className={`py-1 px-2 rounded-md text-white/80 ${index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                      }`}
                  >
                    {item.item}
                  </li>
                ))
              ) : (
                <li className="text-white/60 text-center">
                  No items in wishlist.
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {!user.Accepted && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleAcceptUser(user.id)}
            className="flex-1 py-2 bg-gradient-to-r from-green-400/40 to-emerald-500/40 
                       hover:from-green-400/60 hover:to-emerald-500/60 border border-green-300/30 
                       text-white font-semibold rounded-lg shadow-md backdrop-blur-md transition-all"
          >
            Accept
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => openDeleteModal(user.id)}
          className={`py-2 ${user.Accepted ? "w-full" : "flex-1"
            } bg-gradient-to-r from-red-400/40 to-pink-500/40 
             hover:from-red-400/60 hover:to-pink-500/60 border border-red-300/30 
             text-white font-semibold rounded-lg shadow-md backdrop-blur-md transition-all`}
        >
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
}
