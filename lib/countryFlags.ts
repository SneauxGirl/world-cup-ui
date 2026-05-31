/**
 * Country flags via [flag-icons](https://github.com/lipis/flag-icons) (MIT).
 * Maps FIFA / project codes to flag-icons ISO 3166-1-alpha-2 class suffixes.
 */

import { countryToFifa } from "@/lib/nationalTeams";

/** FIFA (and project) codes → flag-icons `fi-xx` suffix (4:3 landscape by default). */
export const FIFA_TO_FLAG_ICON: Record<string, string> = {
  ALG: "dz",
  ARG: "ar",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BRA: "br",
  CAN: "ca",
  CIV: "ci",
  COD: "cd",
  COL: "co",
  CPV: "cv",
  CRC: "cr",
  CRO: "hr",
  CUW: "cw",
  CZE: "cz",
  ECU: "ec",
  EGY: "eg",
  ENG: "gb-eng",
  ESP: "es",
  FRA: "fr",
  GER: "de",
  GHA: "gh",
  HAI: "ht",
  HRV: "hr",
  IRN: "ir",
  IRQ: "iq",
  ITA: "it",
  JOR: "jo",
  JPN: "jp",
  KOR: "kr",
  KSA: "sa",
  MAR: "ma",
  MEX: "mx",
  NED: "nl",
  NOR: "no",
  NZL: "nz",
  PAN: "pa",
  PAR: "py",
  POL: "pl",
  POR: "pt",
  QAT: "qa",
  RSA: "za",
  SCO: "gb-sct",
  SEN: "sn",
  SUI: "ch",
  SWE: "se",
  TUN: "tn",
  TUR: "tr",
  URU: "uy",
  URY: "uy",
  USA: "us",
  UZB: "uz",
};

/** CSS classes for a 4:3 landscape flag from a FIFA-style country code. */
export function getFlagIconClasses(code: string): string | undefined {
  const fifaCode = countryToFifa(code.trim().toUpperCase());
  const icon = FIFA_TO_FLAG_ICON[fifaCode];
  if (!icon) return undefined;
  return `fi fi-${icon}`;
}
