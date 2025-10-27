"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Save, Lock, User, Info } from "lucide-react";
import axios from "axios";

export default function EditProfile({ user, refreshUser }) {
  const [name, setName] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [showInfo, setShowInfo] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setStatus({
        kind: "error",
        message: "Name cannot be empty.",
      });
      return;
    }

    setSaving(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/user/update",
        { name, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (refreshUser) await refreshUser();

      setStatus({
        kind: "success",
        message: "Profile updated successfully!",
      });
      setPassword("");
    } catch (err) {
      console.error(err);
      setStatus({
        kind: "error",
        message: "Error updating profile. Please try again.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ kind: "idle", message: "" }), 3000);
    }
  };

  const accountPending = user?.status === "pending" || user?.Accepted === false;

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative w-11/12 max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-emerald-400/10 backdrop-blur-xl border border-white/30 p-6 sm:p-10 text-center shadow-lg overflow-visible"
    >
      <h2 className="text-xl font-semibold mb-4">👤 Edit Profile</h2>

      {/* 🟡 Status Badge */}
      <div className="mb-6 relative flex flex-col items-center z-30">
        {accountPending ? (
          <div className="flex flex-wrap items-center justify-center gap-2 bg-yellow-400/25 text-yellow-100 border border-yellow-400/50 px-3 py-2 rounded-xl text-[13px] sm:text-sm font-medium shadow-[0_0_10px_rgba(255,220,100,0.4)] animate-pulse-soft relative max-w-[90%] text-center">
            <span className="leading-snug">⚠️ Pending Approval</span>

            <button
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onFocus={() => setShowInfo(true)}
              onBlur={() => setShowInfo(false)}
              className="text-yellow-200 hover:text-yellow-100 flex-shrink-0"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Tooltip (responsive placement) */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full sm:top-auto sm:bottom-full mt-3 sm:mb-2 z-[50]
                             bg-yellow-50/95 text-[#0b1437] text-xs font-medium px-3 py-2
                             rounded-lg shadow-lg border border-yellow-200 w-[90vw] sm:w-auto sm:max-w-[240px]
                             backdrop-blur-md"
                >
                  Your account is waiting for admin approval. Once approved,
                  full Secret&nbsp;Santa access will unlock 🎁
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <span className="inline-block bg-green-500/30 text-green-100 border border-green-400/40 px-4 py-1 rounded-full text-sm font-medium shadow-[0_0_12px_rgba(0,255,150,0.3)]">
            ✅ Accepted & Active
          </span>
        )}
      </div>

      {/* 🖼️ Profile Picture */}
      <div className="relative flex flex-col items-center gap-4 z-10">
        <div className="relative">
          <img
            src={user?.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-white/30 object-cover relative z-0"
          />
          <button className="absolute bottom-0 right-0 bg-sky-300 text-[#0b1437] p-2 rounded-full shadow z-10">
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* 🧍 Name Field */}
        <div className="relative w-full">
          <User className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition"
          />
        </div>

        {/* 🔒 Password Field */}
        <div className="relative w-full">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-sky-300/60 transition"
          />
        </div>

        {/* 💾 Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-2 px-6 py-2 bg-sky-300 text-[#0b1437] rounded-xl text-sm font-medium hover:bg-sky-200 transition disabled:opacity-60"
        >
          {saving ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4 animate-spin" /> Saving...
            </motion.span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </span>
          )}
        </button>
      </div>

      {/* 🧾 Feedback Banner */}
      <div className="mt-4 min-h-[32px]">
        <AnimatePresence>
          {status.kind !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mx-auto w-full text-center text-sm px-3 py-2 rounded-xl border backdrop-blur-md ${status.kind === "success"
                  ? "bg-green-500/20 border-green-400/40 text-green-100"
                  : "bg-red-500/20 border-red-400/40 text-red-100"
                }`}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✨ Soft Pulse Animation */}
      <style jsx>{`
        @keyframes softPulse {
          0%,
          100% {
            box-shadow: 0 0 8px rgba(255, 220, 0, 0.4),
              0 0 16px rgba(255, 200, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 14px rgba(255, 240, 100, 0.7),
              0 0 26px rgba(255, 220, 0, 0.6);
          }
        }
        .animate-pulse-soft {
          animation: softPulse 1.8s infinite ease-in-out;
        }
      `}</style>
    </motion.div>
  );
}
