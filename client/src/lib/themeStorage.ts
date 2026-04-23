export type ThemeMode = "light" | "dark";

const KEY = "tower-map-theme";

export function readStoredTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeStoredTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* ignore */
  }
}

export function applyThemeToDocument(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode;
}
