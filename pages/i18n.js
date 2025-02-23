import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/common.json"; // Your English translations
import es from "../public/locales/es/common.json"; // Your Spanish translations

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		es: { translation: es },
	},
	lng: "en", // Default language
	fallbackLng: "en", // Fallback language
	interpolation: {
		escapeValue: false, // React already escapes variables
	},
});

const I18nPage = () => {
  return (
    <div>
      <h1>Language Settings</h1>
      {/* Add your translation components here */}
    </div>
  );
};

export default I18nPage;
