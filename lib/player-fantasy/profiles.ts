import rawProfiles from "@/data/player-fantasy-profiles.json";
import type { PlayerFantasyProfile, PlayerFantasyProfileMap } from "@/lib/player-fantasy/types";

const profiles = rawProfiles as PlayerFantasyProfileMap;

export function getPlayerProfile(playerId: string): PlayerFantasyProfile | undefined {
  return profiles[playerId];
}

export function getAllPlayerProfiles(): PlayerFantasyProfileMap {
  return profiles;
}

export function getTotalFantasyPoints(playerId: string): number {
  return profiles[playerId]?.totalFantasyPoints ?? 0;
}

export function hasPlayerProfile(playerId: string): boolean {
  return playerId in profiles;
}
