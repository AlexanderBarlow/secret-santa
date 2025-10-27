"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Info, Clock } from "lucide-react";
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
  const [countdown, setCountdown] = useState("");

  /* ---------------- Countdown Timer ---------------- */
  useEffect(() => {
    if (!eventDetails?.eventDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(eventDetails.eventDate);
      const diff = eventDate - now;

      if (diff <= 0) {
        setCountdown("🎉 The event has started!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(
        `${days}d ${hours}h ${minutes}m ${seconds}s until the event 🎁`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDetails?.eventDate]);

  /* ---------------- Animation Variants ---------------- */
  const leftSlide = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 60, damping: 15, delay: 0.1 },
    },
  };

  const rightSlide = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 60, damping: 15, delay: 0.2 },
    },
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-11/12 max-w-5xl mx-auto flex flex-col lg:flex-row justify-between items-stretch gap-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-red-400/5 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)] p-6 sm:p-8 text-center"
    >
      {/* ------- Left Side: Profile + Event Info ------- */}
      <motion.div
        variants={leftSlide}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center lg:items-start lg:w-1/2"
      >
        <motion.img
          src={user?.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 object-cover shadow-lg mb-4"
          whileHover={{ scale: 1.05 }}
        />
        <h2 className="text-xl font-semibold mb-3">{user?.email}</h2>

        <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 mb-4 backdrop-blur-sm shadow-inner text-left">
          <div className="flex items-center gap-2 mb-2">
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

          {/* ⏳ Live Countdown */}
          {countdown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-3"
            >
              <Clock className="w-4 h-4 text-sky-300" />
              <span className="text-sm text-sky-200 font-medium">
                {countdown}
              </span>
            </motion.div>
          )}

          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-300 mt-1" />
            <p className="text-sm text-white/80 leading-relaxed">
              {eventDetails.overview
                ? eventDetails.overview
                : t("No event overview provided yet.")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ------- Right Side: Wishlist ------- */}
      <motion.div
        variants={rightSlide}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 flex flex-col justify-center items-center"
      >
        <WishlistForm
          wishlistInputs={wishlistInputs}
          setWishlistInputs={setWishlistInputs}
          invalidIndices={invalidIndices}
          saving={saving}
          saveStatus={saveStatus}
          onSave={onSave}
        />
      </motion.div>
    </motion.div>
  );
}
