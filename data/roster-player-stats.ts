import type { RosterPlayerSeasonStats, RosterPlayerStatKey } from "@/data/types";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import { getPlayerProfile } from "@/lib/player-fantasy/profiles";

export const ROSTER_STAT_KEYS: RosterPlayerStatKey[] = [
  "gp",
  "gs",
  "mp",
  "g",
  "hg",
  "pkg",
  "a",
  "s",
  "sog",
  "soff",
  "off",
  "ck",
  "yc",
  "rc",
  "yrc",
];

/** Primary highlight column in the comparison table. */
export const ROSTER_STAT_HIGHLIGHT_KEY: RosterPlayerStatKey = "g";

const POSITION_ORDER: Record<SquadPositionCode, number> = {
  GKP: 0,
  DEF: 1,
  MID: 2,
  FWD: 3,
};

const EMPTY_STATS: RosterPlayerSeasonStats = {
  gp: 0,
  gs: 0,
  mp: 0,
  g: 0,
  hg: 0,
  pkg: 0,
  a: 0,
  s: 0,
  sog: 0,
  soff: 0,
  off: 0,
  ck: 0,
  yc: 0,
  rc: 0,
  yrc: 0,
};

export function getRosterPlayerStats(
  playerId: string,
  _position: SquadPositionCode,
): RosterPlayerSeasonStats {
  const profile = getPlayerProfile(playerId);
  if (!profile) return EMPTY_STATS;
  return profile.season;
}

export function compareRosterPlayers(
  a: { position: SquadPositionCode; stats: RosterPlayerSeasonStats },
  b: { position: SquadPositionCode; stats: RosterPlayerSeasonStats },
): number {
  const pos = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
  if (pos !== 0) return pos;
  return b.stats.g - a.stats.g;
}

export function formatStatCell(value: number): string {
  return value === 0 ? "—" : String(value);
}
