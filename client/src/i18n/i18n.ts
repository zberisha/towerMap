import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";

export const LANG_STORAGE_KEY = "tower-map-lang";

const SUPPORTED = ["en", "de", "fr", "es", "it", "zh", "ja", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED)[number];
export const SUPPORTED_LANGS = SUPPORTED;

function readStoredLanguage(): AppLanguage {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v != null && (SUPPORTED as readonly string[]).includes(v)) return v as AppLanguage;
  } catch {
    /* ignore */
  }
  return "en";
}

function readInitialLanguage(): AppLanguage {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q != null && (SUPPORTED as readonly string[]).includes(q)) return q as AppLanguage;
  } catch {
    /* ignore */
  }
  return readStoredLanguage();
}

function syncLangQueryParam(lng: string) {
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.get("lang") === lng) return;
    u.searchParams.set("lang", lng);
    window.history.replaceState({}, "", u.toString());
  } catch {
    /* ignore */
  }
}

function syncHtmlFromI18n() {
  const lng = i18n.language;
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      it: { translation: it },
      zh: { translation: zh },
      ja: { translation: ja },
      ar: { translation: ar },
    },
    lng: readInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  .then(() => {
    syncHtmlFromI18n();
    syncLangQueryParam(i18n.language);
  });

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  syncHtmlFromI18n();
  syncLangQueryParam(lng);
});

export { i18n };
