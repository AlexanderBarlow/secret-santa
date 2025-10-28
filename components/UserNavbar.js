"use client";

import { Home, User, Gift, AlertTriangle, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function UserNavbar({ tab, setTab, user }) {
  const isPending = user?.Accepted === false || user?.status === "pending";
  const lockSanta = isPending; // only lock Santa tab now
  const lockHome = false; // home/wishlist stays open

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
            onClick={() => setTab("profile")}
            className={`flex flex-col items-center justify-center text-sm transition ${tab === "profile" ? "text-emerald-300" : "text-white/70"
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
              className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border border-yellow-200 shadow-[0_0_15px_rgba(255,220,0,0.9)] animate-pulse"
            >
              <AlertTriangle className="w-3 h-3 text-[#0b1437]" />
              <span className="sr-only">Pending Account</span>
            </motion.div>
          )}
        </div>

        {/* -------- Santa Tab (Locked if pending) -------- */}
        <div className="relative">
          <button
            onClick={() => !lockSanta && setTab("santa")}
            disabled={lockSanta}
            className={`flex flex-col items-center justify-center text-sm transition relative ${tab === "santa" ? "text-sky-300" : "text-white/70"
              } ${lockSanta ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Gift className="w-6 h-6 mb-0.5" />
            <span className="text-[11px] leading-none">Santa</span>
          </button>

          {lockSanta && (
            <div className="absolute -top-2 -right-3 bg-yellow-400/30 border border-yellow-200/40 rounded-full p-1 animate-pulse">
              <Lock className="w-3 h-3 text-yellow-200" />
            </div>
          )}
        </div>

        {/* -------- Home Button (Floating, Always Open) -------- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]">
          <button
            onClick={() => !lockHome && setTab("home")}
            className={`flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full ${tab === "home"
                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                : "bg-white/30 text-white"
              } border border-white/40 transition-all duration-300`}
          >
            <Home className="w-7 h-7 mb-0.5" />
            <span className="text-[11px] font-medium leading-none">Home</span>
          </button>
        </div>
      </motion.div>

      {/* Custom pulse animation */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(255, 220, 0, 0.6),
              0 0 20px rgba(255, 200, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(255, 240, 120, 0.9),
              0 0 32px rgba(255, 220, 0, 0.8);
          }
        }
        .animate-pulse {
          animation: pulse-glow 1.6s infinite;
        }
      `}</style>
    </nav>
  );
}
