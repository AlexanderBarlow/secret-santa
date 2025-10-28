"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Save, Sparkles } from "lucide-react";

const MAX_ITEMS = 5;
const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "pussy",
  "cunt",
  "nigger",
  "kike",
  "chink",
  "spic",
  "faggot",
  "kill myself",
  "suicide",
  "hang myself",
];
const isInappropriate = (text = "") =>
  BAD_WORDS.some((w) => text.toLowerCase().includes(w));

/* ---------------- Frosted Button ---------------- */
const FrostedButton = ({ onClick, icon, label, className = "", disabled }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.08 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    disabled={disabled}
    onClick={onClick}
    className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/25 backdrop-blur-md bg-gradient-to-r from-red-500/30 via-green-500/30 to-sky-400/30 text-white shadow-lg transition-all duration-300 disabled:opacity-50 ${className}`}
    aria-label={label}
  >
    {icon}
  </motion.button>
);

const WishlistForm = memo(function WishlistForm({
  wishlistInputs,
  setWishlistInputs,
  onSave,
  invalidIndices,
  saving,
  saveStatus,
}) {
  const canAdd = wishlistInputs.length < MAX_ITEMS;
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (saveStatus.kind === "success") {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleInputChange = (index, value) => {
    setWishlistInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddWishlistItem = () => {
    if (!canAdd) return;
    setWishlistInputs((prev) => [...prev, ""]);
  };

  const handleDelete = (index) => {
    setWishlistInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const remaining = MAX_ITEMS - wishlistInputs.length;

  return (
    <div className="mt-6 relative">
      {/* Magic Dust Sparkles */}
      <AnimatePresence>
        {showSparkles &&
          Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-200 via-white to-emerald-300 rounded-full pointer-events-none"
              initial={{
                opacity: 1,
                scale: 0.6,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 0,
                scale: 1.5,
                x: Math.random() * 120 - 60,
                y: Math.random() * -80 - 10,
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.3,
                ease: "easeOut",
              }}
              style={{
                left: "50%",
                bottom: "15%",
                filter: "drop-shadow(0 0 6px rgba(255,255,200,0.9))",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm">
          You can add up to {MAX_ITEMS} items 🎁
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${remaining >= 0 ? "bg-green-500/30" : "bg-red-500/40"
            } border border-white/25`}
        >
          {Math.max(remaining, 0)} remaining
        </span>
      </div>

      {/* Wishlist Inputs */}
      <div className="space-y-3">
        {wishlistInputs.map((item, i) => {
          const isInvalid = invalidIndices.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <motion.input
                type="text"
                value={item}
                onChange={(e) => handleInputChange(i, e.target.value)}
                placeholder={`🎁 Wishlist Item ${i + 1}`}
                className={`w-full px-4 py-3 bg-white/20 border ${isInvalid
                    ? "border-red-400/70 ring-2 ring-red-400/40"
                    : "border-white/25"
                  } rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition-all duration-200`}
                whileFocus={{ scale: 1.01 }}
              />
              <FrostedButton
                onClick={() => handleDelete(i)}
                label="Delete Item"
                icon={<Trash2 className="w-4 h-4" />}
                className="!w-10 !h-10"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Add + Save Buttons */}
      <div className="flex justify-center gap-3 pt-5 relative z-10">
        <FrostedButton
          onClick={handleAddWishlistItem}
          label="Add Item"
          icon={<Plus className="w-5 h-5" />}
          disabled={!canAdd}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold border border-white/30 bg-gradient-to-r from-green-400/40 via-sky-400/40 to-red-400/40 text-white backdrop-blur-md shadow-md transition disabled:opacity-60`}
        >
          <Save className={`w-4 h-4 ${saving ? "animate-pulse" : ""}`} />
          {saving ? "Saving..." : "Save Wishlist"}
        </motion.button>
      </div>

      {/* Save Status Banner */}
      <div className="mt-4 min-h-[32px]">
        {saveStatus.kind !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`mx-auto w-full text-center text-sm px-3 py-2 rounded-xl border backdrop-blur-md ${saveStatus.kind === "success"
                ? "bg-green-500/20 border-green-400/40 text-green-100"
                : "bg-red-500/20 border-red-400/40 text-red-100"
              }`}
          >
            {saveStatus.message}
          </motion.div>
        )}
      </div>
    </div>
  );
});

export default WishlistForm;
