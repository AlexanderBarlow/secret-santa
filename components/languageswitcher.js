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
    <div className="absolute top-5 right-5">
      <span className="mr-2 text-sm text-gray-600">English</span>
      <div className="relative inline-block w-16 mr-4 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          id="toggle-switch"
          checked={language === "es"}
          onChange={() => switchLanguage(language === "en" ? "es" : "en")}
          className="toggle-checkbox absolute block w-8 h-8 rounded-full bg-white border-4 appearance-none cursor-pointer"
        />
        <label
          htmlFor="toggle-switch"
          className="toggle-label block h-8 rounded-full bg-gray-300 cursor-pointer"
        ></label>
      </div>
      <span className="ml-2 text-sm text-gray-600">Español</span>
    </div>
  );
}
