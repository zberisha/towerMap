import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSkyscrapers } from "./lib/api";
import { applyThemeToDocument, readStoredTheme, writeStoredTheme, type ThemeMode } from "./lib/themeStorage";
import type { Skyscraper } from "./types/skyscraper";
import { LanguageSelect } from "./components/LanguageSelect";
import { SeoHead } from "./components/SeoHead";
import { SkyscraperMap } from "./components/SkyscraperMap";
import { TowerDialog } from "./components/TowerDialog";
import styles from "./app.module.css";

export default function App() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Skyscraper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<Skyscraper | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme() ?? "dark");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    writeStoredTheme(theme);
  }, [theme]);

  const dbCountries = useMemo(() => new Set(items.map((i) => i.country)), [items]);

  const visibleTowers = useMemo(() => {
    if (selectedCountry == null) return items;
    return items.filter((i) => i.country === selectedCountry);
  }, [items, selectedCountry]);

  const maxHeightM = useMemo(
    () => (visibleTowers.length > 0 ? Math.max(...visibleTowers.map((i) => i.heightM)) : 1),
    [visibleTowers]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const data = await fetchSkyscrapers();
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelectTower = useCallback((tower: Skyscraper) => {
    setSelected(tower);
    setDialogOpen(true);
  }, []);

  const onDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setSelected(null);
  }, []);

  const handleCountrySelect = useCallback((db: string) => {
    setSelectedCountry((prev) => (prev === db ? null : db));
  }, []);

  const countLabel =
    selectedCountry != null
      ? t("app.towersFiltered", { visible: visibleTowers.length, total: items.length })
      : t("app.towersInDb", { count: items.length });

  return (
    <Tooltip.Provider delayDuration={300}>
      <SeoHead />
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <Tooltip.Root>
              <h1 className={styles.brandHeading}>
                <Tooltip.Trigger asChild>
                  <button type="button" className={styles.titleTrigger}>
                    {t("app.title")}
                  </button>
                </Tooltip.Trigger>
              </h1>
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
                  {t("app.introTooltip")}
                  <Tooltip.Arrow className={styles.tooltipArrow} width={10} height={5} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <p>{t("app.subtitle")}</p>
          </div>
          <div className={styles.headerActions}>
            {selectedCountry != null && (
              <button
                type="button"
                className={styles.filterChip}
                onClick={() => setSelectedCountry(null)}
                aria-label={t("app.clearFilter", { country: selectedCountry })}
              >
                <span>{selectedCountry}</span>
                <span className={styles.filterChipX} aria-hidden>
                  ×
                </span>
              </button>
            )}
            <LanguageSelect />
            <div className={styles.themeRow}>
              <span className={styles.themeLabel} id="theme-label">
                {t("app.lightTheme")}
              </span>
              <Switch.Root
                className={styles.switchRoot}
                checked={theme === "light"}
                onCheckedChange={(v) => setTheme(v ? "light" : "dark")}
                aria-labelledby="theme-label"
              >
                <Switch.Thumb className={styles.switchThumb} />
              </Switch.Root>
            </div>
            <div className={styles.meta}>{loading ? t("app.loading") : countLabel}</div>
          </div>
        </header>
        <main className={styles.main}>
          {loadError && (
            <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
              {t("app.errorBanner")} <code className={styles.code}>npm run seed -w server</code>.
            </div>
          )}
          {!loading && !loadError && items.length === 0 && (
            <div className={styles.banner}>{t("app.noData")}</div>
          )}
          <div className={styles.mapArea}>
            {!loading && items.length > 0 && (
              <SkyscraperMap
                allTowers={items}
                visibleTowers={visibleTowers}
                maxHeightM={maxHeightM}
                theme={theme}
                selectedCountry={selectedCountry}
                dbCountries={dbCountries}
                onCountrySelect={handleCountrySelect}
                onSelectTower={onSelectTower}
              />
            )}
          </div>
        </main>
      </div>
      {selected != null && (
        <TowerDialog
          tower={selected}
          maxHeightM={maxHeightM}
          open={dialogOpen}
          onOpenChange={onDialogOpenChange}
        />
      )}
    </Tooltip.Provider>
  );
}
