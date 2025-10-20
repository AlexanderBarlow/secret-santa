import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function LanguageSwitcher({ theme = "auto" }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    if (theme === "auto") {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      setIsDark(brightness < 128);
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
      className={`fixed top-2 right-2 z-50 flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
        isDark
          ? "bg-white/10 border-white/20 text-white"
          : "bg-black/10 border-black/20 text-black"
      }`}
    >
      {/* EN */}
      <span
        className={`text-[10px] font-medium ${
          language === "en"
            ? "opacity-100"
            : isDark
            ? "opacity-50 text-white/70"
            : "opacity-50 text-black/70"
        }`}
      >
        EN
      </span>

      {/* Toggle Switch */}
      <div
        onClick={() => switchLanguage(language === "en" ? "es" : "en")}
        className={`relative w-7 h-3 flex items-center rounded-full p-[1px] cursor-pointer transition-all duration-300 ${
          isDark ? "bg-white/30" : "bg-black/30"
        }`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "bg-white" : "bg-black"
          } ${language === "es" ? "translate-x-3.5" : "translate-x-0"}`}
        />
      </div>

      {/* ES */}
      <span
        className={`text-[10px] font-medium ${
          language === "es"
            ? "opacity-100"
            : isDark
            ? "opacity-50 text-white/70"
            : "opacity-50 text-black/70"
        }`}
      >
        ES
      </span>
    </div>
  );
}
