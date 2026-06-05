import { playerRecentActivity } from "@/data/player-recent-activity";
import type { RosterFeedDisplayItem } from "@/data/types";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";

const DEFAULT_INITIAL_VISIBLE = 4;

export function buildRosterRecentActivity(
  rosterBySlot: Record<string, SquadPlayerPoolEntry>,
  limit?: number,
): RosterFeedDisplayItem[] {
  const rosterPlayerIds = new Set(Object.values(rosterBySlot).map((player) => player.id));

  const items = playerRecentActivity
    .filter((activity) => rosterPlayerIds.has(activity.playerId))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((activity) => ({
      id: `recent-${activity.playerId}`,
      message: activity.message,
      pts: activity.pts,
    }));

  return limit === undefined ? items : items.slice(0, limit);
}

export { DEFAULT_INITIAL_VISIBLE as RECENT_ACTIVITY_INITIAL_VISIBLE };
