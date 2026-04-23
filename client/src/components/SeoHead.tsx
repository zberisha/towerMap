import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type AppLanguage } from "../i18n/i18n";

function hrefLangAttr(code: AppLanguage): string {
  if (code === "zh") return "zh-Hans";
  return code;
}

export function SeoHead() {
  const { t, i18n } = useTranslation();

  const origin = useMemo(() => {
    const fromEnv = import.meta.env.VITE_PUBLIC_SITE_URL?.replace(/\/$/, "");
    if (fromEnv) return fromEnv;
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }, []);

  const pathname = typeof window !== "undefined" ? window.location.pathname || "/" : "/";

  const urlsByLang = useMemo(() => {
    const out = {} as Record<AppLanguage, string>;
    const o = origin || (typeof window !== "undefined" ? window.location.origin : "");
    for (const code of SUPPORTED_LANGS) {
      const u = new URL(pathname, o || "http://127.0.0.1");
      u.searchParams.set("lang", code);
      out[code] = u.href;
    }
    return out;
  }, [origin, pathname]);

  const lang = i18n.language as AppLanguage;
  const canonical = urlsByLang[lang] ?? urlsByLang.en;

  const jsonLd = useMemo(() => {
    const keywords = t("seo.metaKeywords")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t("app.title"),
      description: t("seo.metaDescription"),
      abstract: t("seo.llmSummary"),
      url: canonical,
      applicationCategory: "MapApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. WebGL recommended for 3D tower previews.",
      inLanguage: SUPPORTED_LANGS.map(hrefLangAttr),
      keywords,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };
  }, [t, canonical, i18n.language]);

  const ogBase = origin || (typeof window !== "undefined" ? window.location.origin : "");
  const ogImage = `${ogBase}/favicon.svg`;

  return (
    <Helmet>
      <html lang={i18n.language} dir={i18n.dir(i18n.language)} />
      <title>{t("app.documentTitle")}</title>
      <meta name="description" content={t("seo.metaDescription")} />
      <meta name="keywords" content={t("seo.metaKeywords")} />
      <meta name="summary" content={t("seo.llmSummary")} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="apple-mobile-web-app-title" content={t("app.title")} />
      <link rel="canonical" href={canonical} />
      {SUPPORTED_LANGS.map((code) => (
        <link key={code} rel="alternate" hrefLang={hrefLangAttr(code)} href={urlsByLang[code]} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlsByLang.en} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={t("app.documentTitle")} />
      <meta property="og:description" content={t("seo.metaDescription")} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={t("app.title")} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:locale" content={t("seo.ogLocale")} />
      {SUPPORTED_LANGS.filter((c) => c !== lang).map((code) => (
        <meta
          key={code}
          property="og:locale:alternate"
          content={i18n.t("seo.ogLocale", { lng: code })}
        />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t("app.documentTitle")} />
      <meta name="twitter:description" content={t("seo.metaDescription")} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
