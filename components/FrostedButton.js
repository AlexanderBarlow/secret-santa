"use client";

import { motion } from "framer-motion";

export default function FrostedButton({
  onClick,
  icon,
  label,
  className = "",
  type = "button",
  disabled = false,
}) {
  return (
    <motion.button
      type={type}
      whileHover={
        !disabled
          ? {
              scale: 1.08,
              boxShadow: "0 0 12px rgba(255, 215, 0, 0.7)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/25 backdrop-blur-md bg-gradient-to-r from-red-500/30 via-green-500/30 to-sky-400/30 text-white shadow-lg transition-all duration-300 disabled:opacity-50 ${className}`}
    >
      {icon}
    </motion.button>
  );
}
