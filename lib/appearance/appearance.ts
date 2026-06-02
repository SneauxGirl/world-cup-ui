export type AppearanceMode = "light" | "dark" | "system";

export const APPEARANCE_STORAGE_KEY = "wcui-appearance";

/** Designer info row in the account portal (LinkedIn / GitHub / email). */
export const ACCOUNT_PORTAL_DESIGNER_VISIBLE = true;

export function readStoredAppearance(): AppearanceMode {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function resolveAppearance(mode: AppearanceMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyAppearance(mode: AppearanceMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveAppearance(mode);
  document.documentElement.dataset.wcuiAppearance = mode;
  document.documentElement.style.colorScheme = resolved;
}
