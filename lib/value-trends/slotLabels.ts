import { squadPitchFormation } from "@/data/squad-pitch-formation";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";

export function getSlotLabel(slotId: string): string {
  const slot = squadPitchFormation.find((entry) => entry.id === slotId);
  if (!slot) return slotId;
  const labels: Record<SquadPositionCode, string> = {
    GKP: "GK",
    DEF: "DEF",
    MID: "MID",
    FWD: "FWD",
  };
  const match = slotId.match(/^(gk|def|mid|fwd)-(\d+)$/);
  const num = match?.[2] ?? "";
  return `${labels[slot.position]} ${num}`;
}
