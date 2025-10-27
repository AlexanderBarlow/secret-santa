"use client";

import { motion } from "framer-motion";
import { Calendar, Info } from "lucide-react";
import WishlistForm from "./WishlistForm";

export default function UserInfoCard({
  user,
  eventDetails,
  wishlistInputs,
  setWishlistInputs,
  invalidIndices,
  saving,
  saveStatus,
  onSave,
  t,
}) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-11/12 max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-red-400/10 backdrop-blur-xl border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.2)] p-6 sm:p-10 text-center"
    >
      {/* Profile Section */}
      <motion.img
        src={user?.profilePicture || "/default-profile.png"}
        alt="Profile"
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-4 object-cover shadow-lg"
        whileHover={{ scale: 1.05 }}
      />
      <h2 className="text-xl font-semibold mb-3">{user?.email}</h2>

      {/* Event Info Section */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 backdrop-blur-sm shadow-inner">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-emerald-300" />
          <h3 className="text-lg font-semibold text-emerald-200">
            {t("Event Information")}
          </h3>
        </div>

        <p className="text-sm text-white/90 mb-2">
          <strong className="text-emerald-300">{t("Event Date")}:</strong>{" "}
          {eventDetails.eventDate
            ? new Date(eventDetails.eventDate).toLocaleDateString()
            : "-"}
        </p>

        <div className="flex items-start justify-center gap-2 text-left">
          <Info className="w-4 h-4 text-emerald-300 mt-1" />
          <p className="text-sm text-white/80 max-w-[90%] leading-relaxed">
            {eventDetails.overview
              ? eventDetails.overview
              : t("No event overview provided yet.")}
          </p>
        </div>
      </div>

      {/* Wishlist Form */}
      <WishlistForm
        wishlistInputs={wishlistInputs}
        setWishlistInputs={setWishlistInputs}
        invalidIndices={invalidIndices}
        saving={saving}
        saveStatus={saveStatus}
        onSave={onSave}
      />
    </motion.div>
  );
}
