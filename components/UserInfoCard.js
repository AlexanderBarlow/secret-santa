"use client";

import { motion } from "framer-motion";
import WishlistForm from "./WishlistForm"; // ✅ we'll use the existing form

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
      <motion.img
        src={user?.profilePicture || "/default-profile.png"}
        alt="Profile"
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-4 object-cover shadow-lg"
        whileHover={{ scale: 1.05 }}
      />
      <h2 className="text-xl font-semibold mb-2">{user?.email}</h2>

      <div className="text-sm text-white/80 space-y-1 mb-4">
        <p>
          <strong>{t("Event Date")}:</strong>{" "}
          {eventDetails.eventDate
            ? new Date(eventDetails.eventDate).toLocaleDateString()
            : "-"}
        </p>
        <p>
          <strong>{t("Match Date")}:</strong>{" "}
          {eventDetails.matchSantaDate
            ? new Date(eventDetails.matchSantaDate).toLocaleDateString()
            : "-"}
        </p>
        <p>
          <strong>{t("Overview")}:</strong> {eventDetails.overview || "-"}
        </p>
      </div>

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
