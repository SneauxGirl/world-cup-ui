"use client";

import { useEffect, useMemo, useState } from "react";
import type { DashboardMatch } from "@/data/types";

const DEMO_INTERVAL_MS = 9000;

function cloneMatches(seed: DashboardMatch[]): DashboardMatch[] {
  return seed.map((m) => ({ ...m, home: { ...m.home }, away: { ...m.away } }));
}

/**
 * Simulates a live score tick on the first live match for aria-live demos.
 */
export function useLiveScoreDemo(seed: DashboardMatch[]) {
  const [matches, setMatches] = useState(() => cloneMatches(seed));
  const firstLiveId = useMemo(
    () => seed.find((m) => m.status === "live")?.id ?? null,
    [seed],
  );

  useEffect(() => {
    if (!firstLiveId) return;
    const id = window.setInterval(() => {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === firstLiveId
            ? {
                ...m,
                homeScore: m.homeScore + 1,
                lastGoalAt: new Date().toISOString(),
              }
            : m,
        ),
      );
    }, DEMO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [firstLiveId]);

  const announcerText = (() => {
    if (!firstLiveId) return "";
    const m = matches.find((x) => x.id === firstLiveId);
    if (!m) return "";
    return `${m.home.code} ${m.homeScore}, ${m.away.code} ${m.awayScore}.`;
  })();

  return { matches, announcerText };
}
