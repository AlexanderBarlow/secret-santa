"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Save, MessageCircle } from "lucide-react";
import FrostedButton from "./FrostedButton";
import axios from "axios";
import QuestionModal from "./QuestionModal"; // New modal for conversation
import { useTranslation } from "react-i18next";

const MAX_ITEMS = 5;

export default function WishlistForm({
  wishlistInputs,
  setWishlistInputs,
  onSave,
  invalidIndices,
  saving,
  saveStatus,
  userId,
}) {
  const [questions, setQuestions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const { t } = useTranslation();

  /* ---------------- Fetch Questions for this User ---------------- */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/questions/get?userId=${userId}&type=received`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [userId]);

  /* ---------------- Helper: Find Question by Item ---------------- */
  const getQuestionsForItem = (itemText) => {
    return questions.filter((q) => q.wishlistItem.item === itemText);
  };

  const canAdd = wishlistInputs.length < MAX_ITEMS;

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
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm">
          {t("You can add up to")} {MAX_ITEMS} {t("items")} 🎁
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${remaining >= 0 ? "bg-green-500/30" : "bg-red-500/40"
            } border border-white/25`}
        >
          {Math.max(remaining, 0)} {t("remaining")}
        </span>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {wishlistInputs.map((item, i) => {
            const isInvalid = invalidIndices.has(i);
            const relatedQuestions = getQuestionsForItem(item);
            const hasQuestion = relatedQuestions.length > 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="flex items-center gap-2 relative"
              >
                <motion.input
                  type="text"
                  value={item}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  placeholder={`🎁 ${t("Wishlist Item")} ${i + 1}`}
                  className={`w-full px-4 py-3 bg-white/20 border ${isInvalid
                      ? "border-red-400/70 ring-2 ring-red-400/40"
                      : "border-white/25"
                    } rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition-all duration-200`}
                  whileFocus={{ scale: 1.01 }}
                />

                {/* 🏷️ Delete Button */}
                <FrostedButton
                  onClick={() => handleDelete(i)}
                  label="Delete Item"
                  icon={<Trash2 className="w-4 h-4" />}
                  className="!w-10 !h-10"
                />

                {/* 💬 Question Flag */}
                {hasQuestion && (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setActiveItem({ item, questions: relatedQuestions })
                    }
                    className="absolute right-14 bg-pink-500/50 hover:bg-pink-400/70 rounded-full p-2 border border-white/30 shadow-lg"
                    title="View questions about this item"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-5">
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
          {saving ? t("Saving...") : t("Save Wishlist")}
        </motion.button>
      </div>

      {/* Save banner */}
      <div className="mt-4 min-h-[32px]">
        <AnimatePresence>
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
        </AnimatePresence>
      </div>

      {/* 💬 Question Conversation Modal */}
      <AnimatePresence>
        {activeItem && (
          <QuestionModal
            item={activeItem.item}
            questions={activeItem.questions}
            onClose={() => setActiveItem(null)}
            fetchQuestions={() =>
              axios
                .get(`/api/questions/get?userId=${userId}&type=received`)
                .then((res) => setQuestions(res.data.questions || []))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
