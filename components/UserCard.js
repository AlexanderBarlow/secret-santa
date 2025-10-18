import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserCard({ user, handleAcceptUser, openDeleteModal }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative bg-white/70 backdrop-blur-lg border border-gray-300/40 rounded-2xl shadow-md hover:shadow-[0_0_25px_rgba(255,200,200,0.4)] transition-all p-6 flex flex-col justify-between text-gray-800"
    >
      {/* Subtle gradient sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent rounded-2xl pointer-events-none" />

      {/* Profile */}
      <div className="flex flex-col items-center mb-4 z-10">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        />
        <h3 className="text-lg font-semibold mt-3 text-center text-gray-800">
          {user.email}
        </h3>
      </div>

      {/* Role & Status */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${
            user.role === "FRONT_OF_HOUSE"
              ? "bg-red-100 border-red-300 text-red-700"
              : "bg-blue-100 border-blue-300 text-blue-700"
          }`}
        >
          {user.role === "FRONT_OF_HOUSE" ? "Front of House" : "Back of House"}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${
            user.Accepted
              ? "bg-green-100 border-green-300 text-green-700"
              : "bg-yellow-100 border-yellow-300 text-yellow-700"
          }`}
        >
          {user.Accepted ? "Accepted" : "Pending"}
        </span>
      </div>

      {/* Matched Santa */}
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          🎅 Matched Santa:
        </h4>
        <p className="text-sm font-medium text-gray-800 mt-1 break-words">
          {user.matchedSanta?.email || "N/A"}
        </p>
      </div>

      {/* Wishlist */}
      <div className="mt-3">
        <h4
          className="text-sm font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
          onClick={() => setWishlistOpen(!wishlistOpen)}
        >
          Wishlist:
          <span className="text-xs text-gray-500">
            {wishlistOpen ? "▲ Hide" : "▼ Show"}
          </span>
        </h4>

        <AnimatePresence>
          {wishlistOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-white/80 backdrop-blur-md border border-gray-300/50 rounded-lg p-3 text-sm max-h-40 overflow-auto shadow-inner text-gray-800"
            >
              {user.wishlist?.items?.length > 0 ? (
                user.wishlist.items.map((item, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-200 py-1 last:border-none"
                  >
                    {item.item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No items in wishlist.</li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {!user.Accepted && (
          <button
            onClick={() => handleAcceptUser(user.id)}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Accept
          </button>
        )}
        <button
          onClick={() => openDeleteModal(user.id)}
          className={`py-2 ${
            user.Accepted ? "w-full" : "flex-1"
          } bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all`}
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
