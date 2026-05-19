import nationalTeamsData from "@/data/national-teams.json";

export type TeamColors = {
  primary: string;
  secondary: string;
  alt: string;
  text: string;
};

/** Basename of a file in `public/Players/` (without path). */
export type JerseyAsset =
  | "Black"
  | "Gold"
  | "Green"
  | "Green-mid"
  | "Green2"
  | "LightBlue"
  | "Maroon"
  | "MidRed"
  | "Orange"
  | "Red"
  | "RoyalBlue1"
  | "RoyalBlue2"
  | "White"
  | "Yellow";

export type NationalTeam = {
  code: string;
  colors: TeamColors;
  jersey: JerseyAsset;
  jerseyPath: string;
};

const API_TO_FIFA: Record<string, string> = {
  NET: "NED",
  IRA: "IRN",
  SAU: "KSA",
  COS: "CRC",
  JAP: "JPN",
  SPA: "ESP",
  CRO: "HRV",
  MOR: "MAR",
  CAM: "CMR",
  SER: "SRB",
  SWI: "SUI",
  SOU: "KOR",
  URU: "URY",
};

const teams = nationalTeamsData.teams as NationalTeam[];
const byCode = new Map(teams.map((t) => [t.code, t]));

export function countryToFifa(code: string): string {
  return API_TO_FIFA[code] ?? code;
}

export function getNationalTeam(countryCode: string): NationalTeam | undefined {
  return byCode.get(countryToFifa(countryCode));
}

export function getTeamColors(countryCode: string): TeamColors {
  return (
    getNationalTeam(countryCode)?.colors ?? {
      primary: "#888888",
      secondary: "#CCCCCC",
      alt: "#888888",
      text: "#000000",
    }
  );
}

export function getTeamJerseyAsset(countryCode: string): JerseyAsset {
  return getNationalTeam(countryCode)?.jersey ?? "Red";
}

/** Public URL path for the representative player jersey image. */
export function getTeamJerseyPath(countryCode: string): string {
  return getNationalTeam(countryCode)?.jerseyPath ?? "/Players/Red.png";
}

export function getAllNationalTeams(): NationalTeam[] {
  return teams;
}

/** All jersey asset basenames under `public/Players/`. */
export const JERSEY_ASSETS: readonly JerseyAsset[] = [
  "Black",
  "Gold",
  "Green",
  "Green-mid",
  "Green2",
  "LightBlue",
  "Maroon",
  "MidRed",
  "Orange",
  "Red",
  "RoyalBlue1",
  "RoyalBlue2",
  "White",
  "Yellow",
] as const;
