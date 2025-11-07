"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Save, MessageCircle } from "lucide-react";
import axios from "axios";
import QuestionModal from "./QuestionModal";
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

  /* 🧠 Fetch questions */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/questions/get?userId=${userId}&type=received`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [userId]);

  /* 🧩 Helpers */
  const getQuestionsForItem = (itemText) =>
    questions.filter((q) => q.wishlistItem.item === itemText);

  const hasUnansweredQuestion = (itemText) =>
    questions.some(
      (q) => q.wishlistItem.item === itemText && !q.isAnswered
    );

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

  const handleSave = () => {
    const cleaned = wishlistInputs
      .map((i) => i?.trim())
      .filter((i) => i?.length > 0);
    onSave(cleaned);
  };

  const remaining = MAX_ITEMS - wishlistInputs.length;

  /* ---------------- UI ---------------- */
  return (
    <div className="mt-4 w-full max-w-xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 text-center sm:text-left">
        <p className="text-white/80 text-sm">
          {t("You can add up to")} {MAX_ITEMS} {t("items")} 🎁
        </p>
        <span
          className={`text-xs px-2.5 py-1 rounded-full ${remaining >= 0 ? "bg-green-500/25" : "bg-red-500/30"
            } border border-white/20 backdrop-blur-md`}
        >
          {Math.max(remaining, 0)} {t("remaining")}
        </span>
      </div>

      {/* Inputs */}
      <div className="space-y-2 sm:space-y-3">
        <AnimatePresence initial={false}>
          {wishlistInputs.map((item, i) => {
            const isInvalid = invalidIndices.has(i);
            const relatedQuestions = getQuestionsForItem(item);
            const hasQuestion = relatedQuestions.length > 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white/10 rounded-xl border border-white/15 backdrop-blur-lg px-3 py-2 flex items-center relative"
              >
                {/* Input */}
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  placeholder={`${t("Item")} ${i + 1}`}
                  className={`bg-transparent w-full text-sm text-white placeholder-white/40 focus:outline-none ${isInvalid ? "text-red-300" : ""
                    }`}
                />

                {/* 💬 Questions */}
                {hasQuestion && (
                  <button
                    onClick={() =>
                      setActiveItem({ item, questions: relatedQuestions })
                    }
                    className="ml-1 relative"
                  >
                    <MessageCircle size={17} className="text-white/70" />
                    {hasUnansweredQuestion(item) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </button>
                )}

                {/* 🗑️ Delete */}
                <button
                  onClick={() => handleDelete(i)}
                  className="ml-2 opacity-40 hover:opacity-90 transition"
                >
                  <Trash2 size={17} className="text-red-300" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          onClick={handleAddWishlistItem}
          disabled={!canAdd}
          className="flex-1 py-2 rounded-lg bg-white/15 border border-white/20 text-white text-sm font-medium disabled:opacity-30 transition active:scale-[0.98]"
        >
          <Plus size={16} className="inline mr-1" />
          {t("Add")}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-400/40 via-sky-400/40 to-red-400/40 border border-white/30 text-white text-sm font-semibold shadow hover:shadow-md transition active:scale-[0.98] flex items-center justify-center gap-1"
        >
          <Save size={15} className={`${saving ? "animate-pulse" : ""}`} />
          {saving ? t("Saving...") : t("Save")}
        </button>
      </div>

      {/* Save banner */}
      <div className="mt-3 min-h-[30px]">
        <AnimatePresence>
          {saveStatus.kind !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`mx-auto w-full text-center text-xs px-3 py-2 rounded-xl border backdrop-blur-md ${saveStatus.kind === "success"
                  ? "bg-green-500/20 border-green-400/40 text-green-100"
                  : "bg-red-500/20 border-red-400/40 text-red-100"
                }`}
            >
              {saveStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💬 Question Modal */}
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
