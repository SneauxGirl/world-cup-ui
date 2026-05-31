import { squadPitchFormation, type SquadPositionCode } from "@/data/squad-pitch-formation";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";

/** First empty slot for this position in formation order (left to right on pitch). */
export function findNextEmptySlotId(
  rosterBySlot: Record<string, SquadPlayerPoolEntry | undefined>,
  position: SquadPositionCode,
): string | null {
  for (const slot of squadPitchFormation) {
    if (slot.position !== position) continue;
    if (!rosterBySlot[slot.id]) return slot.id;
  }
  return null;
}

export function isPlayerOnRoster(
  rosterBySlot: Record<string, SquadPlayerPoolEntry | undefined>,
  playerId: string,
): boolean {
  return Object.values(rosterBySlot).some((entry) => entry?.id === playerId);
}
