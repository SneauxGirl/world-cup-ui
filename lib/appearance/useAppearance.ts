"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyAppearance,
  APPEARANCE_STORAGE_KEY,
  readStoredAppearance,
  type AppearanceMode,
} from "@/lib/appearance/appearance";

export function useAppearance() {
  const [mode, setModeState] = useState<AppearanceMode>(() => readStoredAppearance());

  useEffect(() => {
    applyAppearance(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyAppearance("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: AppearanceMode) => {
    setModeState(next);
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
    applyAppearance(next);
  }, []);

  return { mode, setMode };
}
