import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tr from './locales/tr.json';
import en from './locales/en.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      de: { translation: de },
      ar: { translation: ar },
    },
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'de', 'ar'],
    interpolation: {
      escapeValue: false, // React protects from XSS
    },
    detection: {
      // DİKKAT: Botların (Googlebot vb.) otomatik olarak İngilizce'ye yönlendirilmesini
      // (Page with redirect hatasını) engellemek için 'navigator' (tarayıcı dili) kaldırıldı.
      // Artık sadece kullanıcının kendi seçimi (localStorage) dikkate alınacak.
      // Yeni ziyaretçiler ve botlar için dil her zaman URL'den (örn: /tr/...) belirlenir.
      order: ['localStorage'],
      caches: ['localStorage'],
    }
  });

const applyDir = (lng: string) => {
  if (typeof window !== 'undefined') {
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }
};

i18n.on('languageChanged', (lng) => {
  applyDir(lng);
});

if (typeof window !== 'undefined') {
  applyDir(i18n.language);
}

export default i18n;
