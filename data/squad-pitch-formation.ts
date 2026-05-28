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
  { id: "gk-1", position: "GKP", top: 13, left: 35 },
  { id: "gk-2", position: "GKP", top: 13, left: 65 },
  { id: "def-1", position: "DEF", top: 34, left: 8 },
  { id: "def-2", position: "DEF", top: 34, left: 29 },
  { id: "def-3", position: "DEF", top: 34, left: 50 },
  { id: "def-4", position: "DEF", top: 34, left: 71 },
  { id: "def-5", position: "DEF", top: 34, left: 92 },
  { id: "mid-1", position: "MID", top: 55, left: 8 },
  { id: "mid-2", position: "MID", top: 55, left: 29 },
  { id: "mid-3", position: "MID", top: 55, left: 50 },
  { id: "mid-4", position: "MID", top: 55, left: 71 },
  { id: "mid-5", position: "MID", top: 55, left: 92 },
  { id: "fwd-1", position: "FWD", top: 76, left: 25 },
  { id: "fwd-2", position: "FWD", top: 76, left: 50 },
  { id: "fwd-3", position: "FWD", top: 76, left: 75 },
];
