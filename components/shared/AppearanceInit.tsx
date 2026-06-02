"use client";

import { useEffect } from "react";
import { applyAppearance, readStoredAppearance } from "@/lib/appearance/appearance";

/** Applies saved appearance preference on first client paint. */
export function AppearanceInit() {
  useEffect(() => {
    applyAppearance(readStoredAppearance());
  }, []);

  return null;
}
