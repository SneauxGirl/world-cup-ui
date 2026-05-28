/** Squad pitch slot — placement % is center of slot within the square pitch overlay. */

export type SquadPositionCode = "GKP" | "DEF" | "MID" | "FWD";

export type SquadPitchSlot = {
  id: string;
  position: SquadPositionCode;
  top: number;
  left: number;
};

/** 2-5-5-3 formation aligned to PitchSq (goal at top). */
export const squadPitchFormation: SquadPitchSlot[] = [
  { id: "gk-1", position: "GKP", top: 11, left: 36 },
  { id: "gk-2", position: "GKP", top: 11, left: 64 },
  { id: "def-1", position: "DEF", top: 27, left: 11 },
  { id: "def-2", position: "DEF", top: 27, left: 30 },
  { id: "def-3", position: "DEF", top: 27, left: 50 },
  { id: "def-4", position: "DEF", top: 27, left: 70 },
  { id: "def-5", position: "DEF", top: 27, left: 89 },
  { id: "mid-1", position: "MID", top: 46, left: 11 },
  { id: "mid-2", position: "MID", top: 46, left: 30 },
  { id: "mid-3", position: "MID", top: 46, left: 50 },
  { id: "mid-4", position: "MID", top: 46, left: 70 },
  { id: "mid-5", position: "MID", top: 46, left: 89 },
  { id: "fwd-1", position: "FWD", top: 66, left: 30 },
  { id: "fwd-2", position: "FWD", top: 66, left: 50 },
  { id: "fwd-3", position: "FWD", top: 66, left: 70 },
];
