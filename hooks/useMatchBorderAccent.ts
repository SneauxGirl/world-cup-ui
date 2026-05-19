"use client";

import { useEffect, useState } from "react";
import type { DashboardMatch } from "@/data/types";
import {
  getMatchBorderAccent,
  msUntilGoalHighlightEnds,
  type MatchBorderAccent,
} from "@/lib/matchBorderAccent";

/** Re-renders when a goal highlight window expires so the border returns to live/upcoming color. */
export function useMatchBorderAccent(
  match: Pick<DashboardMatch, "status" | "lastGoalAt">,
): MatchBorderAccent {
  const [, tick] = useState(0);

  useEffect(() => {
    const remaining = msUntilGoalHighlightEnds(match.lastGoalAt, Date.now());
    if (remaining == null) return;
    const id = window.setTimeout(() => tick((n) => n + 1), remaining);
    return () => window.clearTimeout(id);
  }, [match.lastGoalAt]);

  return getMatchBorderAccent(match, Date.now());
}
