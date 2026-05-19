import type { DashboardMatch } from "@/data/types";

/** How long the border stays red after a goal (ms). */
export const MATCH_GOAL_HIGHLIGHT_MS = 60_000;

export type MatchBorderAccent = "borderBlue" | "aquaMint" | "primaryRed";

export function getMatchBorderAccent(
  match: Pick<DashboardMatch, "status" | "lastGoalAt">,
  nowMs = Date.now(),
): MatchBorderAccent {
  if (match.lastGoalAt) {
    const goalAt = Date.parse(match.lastGoalAt);
    if (!Number.isNaN(goalAt) && nowMs - goalAt < MATCH_GOAL_HIGHLIGHT_MS) {
      return "primaryRed";
    }
  }

  if (match.status === "upcoming") return "borderBlue";
  if (match.status === "live") return "aquaMint";
  return "borderBlue";
}

export function msUntilGoalHighlightEnds(
  lastGoalAt: string | undefined,
  nowMs = Date.now(),
): number | null {
  if (!lastGoalAt) return null;
  const goalAt = Date.parse(lastGoalAt);
  if (Number.isNaN(goalAt)) return null;
  const remaining = goalAt + MATCH_GOAL_HIGHLIGHT_MS - nowMs;
  return remaining > 0 ? remaining : null;
}
