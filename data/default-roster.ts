import type { UserRosterMap } from "@/data/types";

/**
 * Preload / fallback squad — 15 keep-list players (full 2-5-5-3 formation).
 */
export const DEFAULT_ROSTER_BY_SLOT: UserRosterMap = {
  "gk-1": "argentina-gk-emiliano-martinez",
  "gk-2": "brazil-gk-alisson",
  "def-1": "morocco-df-achraf-hakimi",
  "def-2": "canada-df-alphonso-davies",
  "def-3": "croatia-df-josko-gvardiol",
  "def-4": "france-df-theo-hernandez",
  "def-5": "netherlands-df-virgil-van-dijk",
  "mid-1": "england-mf-jude-bellingham",
  "mid-2": "spain-mf-rodri",
  "mid-3": "germany-mf-jamal-musiala",
  "mid-4": "belgium-mf-kevin-de-bruyne",
  "mid-5": "portugal-mf-bruno-fernandes",
  "fwd-1": "norway-fw-erling-haaland",
  "fwd-2": "egypt-fw-mohamed-salah",
  "fwd-3": "south-korea-fw-heung-min-son",
};

/** All player ids in the default preload squad. */
export const DEFAULT_ROSTER_PLAYER_IDS = new Set(Object.values(DEFAULT_ROSTER_BY_SLOT));

export function isDefaultPreloadPlayer(playerId: string): boolean {
  return DEFAULT_ROSTER_PLAYER_IDS.has(playerId);
}

export function isDefaultRosterMap(rosterMap: UserRosterMap): boolean {
  for (const [slotId, playerId] of Object.entries(DEFAULT_ROSTER_BY_SLOT)) {
    if (rosterMap[slotId] !== playerId) return false;
  }

  for (const slotId of Object.keys(rosterMap)) {
    if (!(slotId in DEFAULT_ROSTER_BY_SLOT)) return false;
  }

  return true;
}
