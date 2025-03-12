import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 shadow-md pt-2">
      <span className="text-sm font-medium text-gray-700">English</span>

      {/* Toggle Switch */}
      <div
        className="relative w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-all duration-300"
        onClick={() => switchLanguage(language === "en" ? "es" : "en")}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            language === "es" ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </div>

      <span className="text-sm font-medium text-gray-700">Español</span>
    </div>
  );
}
