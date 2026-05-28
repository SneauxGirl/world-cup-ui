import rawSquadData from "@/data/wc2026-squads-formatted.json";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";

type RawSquadEntry = {
  nation: string;
  position: "GK" | "DF" | "MF" | "FW";
  player: string;
  caps: number;
  goals: number;
  numberWC22: number | null;
};

export type SquadPlayerPoolEntry = {
  id: string;
  squadNumber: number;
  firstName: string;
  lastName: string;
  countryName: string;
  countryIso2: string;
  teamCode: string;
  position: SquadPositionCode;
  points: number;
};

const nationCodeMap: Record<string, { iso2: string; fifa: string }> = {
  Algeria: { iso2: "dz", fifa: "ALG" },
  Argentina: { iso2: "ar", fifa: "ARG" },
  Australia: { iso2: "au", fifa: "AUS" },
  Austria: { iso2: "at", fifa: "AUT" },
  Belgium: { iso2: "be", fifa: "BEL" },
  "Bosnia and Herzegovina": { iso2: "ba", fifa: "BIH" },
  Brazil: { iso2: "br", fifa: "BRA" },
  Canada: { iso2: "ca", fifa: "CAN" },
  "Cape Verde": { iso2: "cv", fifa: "CPV" },
  Colombia: { iso2: "co", fifa: "COL" },
  Croatia: { iso2: "hr", fifa: "HRV" },
  "Curaçao": { iso2: "cw", fifa: "CUW" },
  "Czech Republic": { iso2: "cz", fifa: "CZE" },
  "DR Congo": { iso2: "cd", fifa: "COD" },
  Ecuador: { iso2: "ec", fifa: "ECU" },
  Egypt: { iso2: "eg", fifa: "EGY" },
  England: { iso2: "gb", fifa: "ENG" },
  France: { iso2: "fr", fifa: "FRA" },
  Germany: { iso2: "de", fifa: "GER" },
  Ghana: { iso2: "gh", fifa: "GHA" },
  Haiti: { iso2: "ht", fifa: "HTI" },
  Iran: { iso2: "ir", fifa: "IRN" },
  Iraq: { iso2: "iq", fifa: "IRQ" },
  "Ivory Coast": { iso2: "ci", fifa: "CIV" },
  Japan: { iso2: "jp", fifa: "JPN" },
  Jordan: { iso2: "jo", fifa: "JOR" },
  Mexico: { iso2: "mx", fifa: "MEX" },
  Morocco: { iso2: "ma", fifa: "MAR" },
  Netherlands: { iso2: "nl", fifa: "NED" },
  "New Zealand": { iso2: "nz", fifa: "NZL" },
  Norway: { iso2: "no", fifa: "NOR" },
  Panama: { iso2: "pa", fifa: "PAN" },
  Paraguay: { iso2: "py", fifa: "PAR" },
  Portugal: { iso2: "pt", fifa: "POR" },
  Qatar: { iso2: "qa", fifa: "QAT" },
  "Saudi Arabia": { iso2: "sa", fifa: "KSA" },
  Scotland: { iso2: "gb", fifa: "SCO" },
  Senegal: { iso2: "sn", fifa: "SEN" },
  "South Africa": { iso2: "za", fifa: "RSA" },
  "South Korea": { iso2: "kr", fifa: "KOR" },
  Spain: { iso2: "es", fifa: "ESP" },
  Sweden: { iso2: "se", fifa: "SWE" },
  Switzerland: { iso2: "ch", fifa: "SUI" },
  Tunisia: { iso2: "tn", fifa: "TUN" },
  Turkey: { iso2: "tr", fifa: "TUR" },
  "United States": { iso2: "us", fifa: "USA" },
  Uruguay: { iso2: "uy", fifa: "URY" },
  Uzbekistan: { iso2: "uz", fifa: "UZB" },
};

function toSlotPosition(position: RawSquadEntry["position"]): SquadPositionCode {
  if (position === "GK") return "GKP";
  if (position === "DF") return "DEF";
  if (position === "MF") return "MID";
  return "FWD";
}

function splitName(player: string): { firstName: string; lastName: string } {
  const parts = player.trim().split(/\s+/);
  return {
    firstName: parts.slice(0, -1).join(" ") || parts[0] || player,
    lastName: parts[parts.length - 1] || player,
  };
}

function toPoints(caps: number, goals: number): number {
  return Math.max(0, Math.round(caps * 1.1 + goals * 5.5));
}

function makeId(entry: RawSquadEntry): string {
  return `${entry.nation}-${entry.position}-${entry.player}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const typedSquad = rawSquadData as RawSquadEntry[];

export const squadPlayerPool: SquadPlayerPoolEntry[] = typedSquad.map((entry) => {
  const codes = nationCodeMap[entry.nation] ?? { iso2: "un", fifa: "UNK" };
  const name = splitName(entry.player);
  return {
    id: makeId(entry),
    squadNumber: entry.numberWC22 ?? 0,
    firstName: name.firstName,
    lastName: name.lastName,
    countryName: entry.nation,
    countryIso2: codes.iso2,
    teamCode: codes.fifa,
    position: toSlotPosition(entry.position),
    points: toPoints(entry.caps, entry.goals),
  };
});
