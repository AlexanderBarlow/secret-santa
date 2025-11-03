"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function LanguageSwitcher({ theme = "auto" }) {
  const router = useRouter();
  const [language, setLanguage] = useState(router.locale || "en");
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    if (theme === "auto") {
      const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(darkQuery.matches);
      const handleChange = (e) => setIsDark(e.matches);
      darkQuery.addEventListener("change", handleChange);
      return () => darkQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    router.push(router.asPath, router.asPath, { locale: newLang });
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      whileTap={{ scale: 0.97 }}
      className={`relative flex items-center justify-between w-20 h-9 rounded-full backdrop-blur-md border transition-all overflow-hidden
        ${isDark
          ? "bg-white/10 border-white/20"
          : "bg-white/40 border-white/60"
        } shadow-[0_4px_20px_rgba(0,0,0,0.15)]`}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-lg"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />

      {/* Sliding knob */}
      <motion.div
        layout
        className={`absolute top-[3px] w-[calc(50%-4px)] h-[calc(100%-6px)] rounded-full shadow-lg 
        ${isDark ? "bg-white/30" : "bg-white/70"}`}
        animate={{
          x: language === "en" ? 2 : 40,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />

      {/* Labels */}
      <div className="relative z-10 flex justify-between w-full px-3 text-[13px] font-semibold tracking-wide">
        <span
          className={`transition-colors ${language === "en"
              ? "text-red-500 drop-shadow-sm"
              : isDark
                ? "text-white/60"
                : "text-gray-600/60"
            }`}
        >
          EN
        </span>
        <span
          className={`transition-colors ${language === "es"
              ? "text-green-500 drop-shadow-sm"
              : isDark
                ? "text-white/60"
                : "text-gray-600/60"
            }`}
        >
          ES
        </span>
      </div>
    </motion.button>
  );
}
