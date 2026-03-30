import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Disease Prediction": "Disease Prediction",
      "Appointment": "Appointment",
      "Healthcare Camps": "Healthcare Camps",
      "Blood Donation": "Blood Donation",
      "Nearby Finder": "Nearby Finder",
      "Current Location": "Current Location",
      "Set location": "Set location",
      "Logout": "Logout",
      "Language": "Language",
      "Search": "Search..."
    }
  },
  hi: {
    translation: {
      "Dashboard": "डैशबोर्ड",
      "Disease Prediction": "रोग की भविष्यवाणी",
      "Appointment": "नियुक्ति",
      "Healthcare Camps": "स्वास्थ्य शिविर",
      "Blood Donation": "रक्तदान",
      "Nearby Finder": "आस-पास खोजें",
      "Current Location": "वर्तमान स्थान",
      "Set location": "स्थान सेट करें",
      "Logout": "लॉग आउट",
      "Language": "भाषा",
      "Search": "खोजें..."
    }
  },
  es: {
    translation: {
      "Dashboard": "Panel de Control",
      "Disease Prediction": "Predicción de Enfermedades",
      "Appointment": "Cita",
      "Healthcare Camps": "Campamentos de Salud",
      "Blood Donation": "Donación de Sangre",
      "Nearby Finder": "Buscador Cercano",
      "Current Location": "Ubicación Actual",
      "Set location": "Establecer ubicación",
      "Logout": "Cerrar sesión",
      "Language": "Idioma",
      "Search": "Buscar..."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
