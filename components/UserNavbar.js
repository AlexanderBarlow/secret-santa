"use client";

import { Home, User, Gift, AlertTriangle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function UserNavbar({ tab, setTab, user }) {
  const isPending = user?.Accepted === false || user?.status === "pending";
  const [hovered, setHovered] = useState(null);

  const handleTabClick = (target) => {
    if (isPending && (target === "home" || target === "santa")) return; // lock tabs
    setTab(target);
  };

  return (
    <nav className="fixed bottom-6 inset-x-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-between w-[88%] max-w-sm h-[70px] px-10 mx-auto rounded-full backdrop-blur-2xl bg-white/15 border-2 border-dashed border-red-300 shadow-[0_8px_35px_rgba(0,0,0,0.35)]"
      >
        {/* -------- Profile Tab -------- */}
        <div className="relative">
          <button
            onClick={() => handleTabClick("profile")}
            className={`flex flex-col items-center justify-center text-sm transition ${
              tab === "profile" ? "text-emerald-300" : "text-white/70"
            }`}
          >
            <User className="w-6 h-6 mb-0.5" />
            <span className="text-[11px] leading-none">Profile</span>
          </button>

          {/* ⚠️ Pending Flag */}
          {isPending && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 8 }}
              className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border border-yellow-200 shadow-[0_0_12px_rgba(255,215,0,0.9)] animate-pulse"
            >
              <AlertTriangle className="w-3 h-3 text-[#0b1437]" />
            </motion.div>
          )}
        </div>

        {/* -------- Santa Tab -------- */}
        <div
          className="relative"
          onMouseEnter={() => setHovered("santa")}
          onMouseLeave={() => setHovered(null)}
        >
          <button
            onClick={() => handleTabClick("santa")}
            disabled={isPending}
            className={`flex flex-col items-center justify-center text-sm transition ${
              isPending
                ? "text-white/40 opacity-60 cursor-not-allowed"
                : tab === "santa"
                ? "text-sky-300"
                : "text-white/70"
            }`}
          >
            {isPending ? (
              <Lock className="w-6 h-6 mb-0.5" />
            ) : (
              <Gift className="w-6 h-6 mb-0.5" />
            )}
            <span className="text-[11px] leading-none">Santa</span>
          </button>

          {/* Tooltip for locked santa tab */}
          <AnimatePresence>
            {isPending && hovered === "santa" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-yellow-100/90 text-[#0b1437] text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-yellow-300 backdrop-blur-md w-max max-w-[180px] text-center"
              >
                You’ll gain access once your account is approved 🎁
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* -------- Floating Home Button -------- */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]"
          onMouseEnter={() => setHovered("home")}
          onMouseLeave={() => setHovered(null)}
        >
          <button
            onClick={() => handleTabClick("home")}
            disabled={isPending}
            className={`flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full ${
              isPending
                ? "bg-white/10 text-white/40 border border-white/30 cursor-not-allowed"
                : tab === "home"
                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                : "bg-white/30 text-white"
            } transition-all duration-300`}
          >
            {isPending ? (
              <Lock className="w-7 h-7 mb-0.5" />
            ) : (
              <Home className="w-7 h-7 mb-0.5" />
            )}
            <span className="text-[11px] font-medium leading-none">Home</span>
          </button>

          {/* Tooltip for locked home tab */}
          <AnimatePresence>
            {isPending && hovered === "home" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-yellow-100/90 text-[#0b1437] text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-yellow-300 backdrop-blur-md w-max max-w-[180px] text-center"
              >
                You’ll gain access once your account is approved 🎁
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Pulse animation for pending flag */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 8px rgba(255, 220, 0, 0.6),
              0 0 16px rgba(255, 200, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 14px rgba(255, 240, 100, 0.9),
              0 0 28px rgba(255, 220, 0, 0.8);
          }
        }
        .animate-pulse {
          animation: pulse-glow 1.6s infinite;
        }
      `}</style>
    </nav>
  );
}
