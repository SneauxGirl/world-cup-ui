"use client";

import { useEffect, useState } from "react";
import {
  MOBILE_MAX_WIDTH_PX,
  SITE_HEADER_COLLAPSE_MAX_WIDTH_PX,
  mediaMaxWidthQuery,
} from "@/lib/media";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(mediaMaxWidthQuery(MOBILE_MAX_WIDTH_PX));
}

export function useSiteHeaderCollapsed(): boolean {
  return useMediaQuery(mediaMaxWidthQuery(SITE_HEADER_COLLAPSE_MAX_WIDTH_PX));
}
