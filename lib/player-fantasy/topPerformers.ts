import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { DashboardPerformer } from "@/data/types";
import { squadPlayerPool } from "@/data/squad-player-pool";
import { getTotalFantasyPoints } from "@/lib/player-fantasy/profiles";

export const ROSTER_TOP_PERFORMERS_MIN = 3;

function toPerformer(entry: SquadPlayerPoolEntry): DashboardPerformer {
  return {
    id: entry.id,
    name: `${entry.firstName} ${entry.lastName}`.trim(),
    teamCode: entry.teamCode,
    position: entry.position,
    points: getTotalFantasyPoints(entry.id),
  };
}

export function buildTopPerformers(
  rosterPlayers: SquadPlayerPoolEntry[],
  limit = 4,
): DashboardPerformer[] {
  const useRoster = rosterPlayers.length >= ROSTER_TOP_PERFORMERS_MIN;
  const source = useRoster ? rosterPlayers : squadPlayerPool;

  return [...source]
    .map(toPerformer)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export function isGlobalTopPerformersMode(rosterCount: number): boolean {
  return rosterCount < ROSTER_TOP_PERFORMERS_MIN;
}
