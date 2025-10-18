import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function LanguageSwitcher({ theme = "auto" }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    if (theme === "auto") {
      // Auto-detect based on body background color brightness
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      setIsDark(brightness < 128); // if background is dark, switch to light style
    } else {
      setIsDark(theme === "dark");
    }
  }, [theme]);

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div
      className={`fixed top-3 right-3 z-50 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-md backdrop-blur-md transition-all duration-300 scale-90 sm:scale-100 ${
        isDark
          ? "bg-white/10 border-white/30 text-white"
          : "bg-black/10 border-black/20 text-black"
      }`}
    >
      <span
        className={`text-[10px] sm:text-xs font-medium transition ${
          language === "en"
            ? isDark
              ? "text-white"
              : "text-black"
            : isDark
            ? "text-white/50"
            : "text-black/50"
        }`}
      >
        EN
      </span>

      {/* Toggle Switch */}
      <div
        className={`relative w-9 sm:w-10 h-4.5 sm:h-5 flex items-center rounded-full p-[2px] cursor-pointer transition-all duration-300 ${
          isDark ? "bg-white/20" : "bg-black/20"
        }`}
        onClick={() => switchLanguage(language === "en" ? "es" : "en")}
      >
        <div
          className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "bg-white" : "bg-black"
          } ${
            language === "es"
              ? "translate-x-4 sm:translate-x-5"
              : "translate-x-0"
          }`}
        />
      </div>

      <span
        className={`text-[10px] sm:text-xs font-medium transition ${
          language === "es"
            ? isDark
              ? "text-white"
              : "text-black"
            : isDark
            ? "text-white/50"
            : "text-black/50"
        }`}
      >
        ES
      </span>
    </div>
  );
}
