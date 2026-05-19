import {
  countryToFifa,
  getNationalTeam,
  type JerseyAsset,
  type NationalTeam,
} from "@/lib/nationalTeams";

type WcuiSnapToken =
  | "--wcui-deep-emerald"
  | "--wcui-dark-emerald"
  | "--wcui-primary-blue"
  | "--wcui-aqua-mint"
  | "--wcui-lime-pulse"
  | "--wcui-broadcast-orange"
  | "--wcui-signal-green"
  | "--wcui-signal-orange"
  | "--wcui-primary-red"
  | "--wcui-burgundy"
  | "--wcui-soft-peach"
  | "--wcui-tournament-purple"
  | "--wcui-pitch-black"
  | "--wcui-panel-black";

const TOKEN_HEX: Record<WcuiSnapToken, string> = {
  "--wcui-deep-emerald": "#054b41",
  "--wcui-dark-emerald": "#00c857",
  "--wcui-primary-blue": "#365afe",
  "--wcui-aqua-mint": "#00e6ec",
  "--wcui-lime-pulse": "#b8ec03",
  "--wcui-broadcast-orange": "#ff4500",
  "--wcui-signal-green": "#00c857",
  "--wcui-signal-orange": "#ffb800",
  "--wcui-primary-red": "#da0301",
  "--wcui-burgundy": "#74180f",
  "--wcui-soft-peach": "#ffb08a",
  "--wcui-tournament-purple": "#7a00ff",
  "--wcui-pitch-black": "#0a0e00",
  "--wcui-panel-black": "#05080d",
};

const GENERAL_SNAP_TOKENS: WcuiSnapToken[] = [
  "--wcui-deep-emerald",
  "--wcui-dark-emerald",
  "--wcui-broadcast-orange",
  "--wcui-signal-green",
  "--wcui-signal-orange",
  "--wcui-primary-red",
  "--wcui-burgundy",
  "--wcui-soft-peach",
  "--wcui-tournament-purple",
  "--wcui-pitch-black",
  "--wcui-panel-black",
];

const JERSEY_INTERIOR_TOKEN: Partial<Record<JerseyAsset, WcuiSnapToken>> = {
  Yellow: "--wcui-lime-pulse",
  LightBlue: "--wcui-aqua-mint",
  RoyalBlue1: "--wcui-primary-blue",
  RoyalBlue2: "--wcui-primary-blue",
  Red: "--wcui-primary-red",
  MidRed: "--wcui-primary-red",
  Maroon: "--wcui-burgundy",
  Orange: "--wcui-broadcast-orange",
  Green: "--wcui-deep-emerald",
  "Green-mid": "--wcui-deep-emerald",
  Green2: "--wcui-deep-emerald",
  Black: "--wcui-pitch-black",
  Gold: "--wcui-signal-orange",
};

const INTERIOR_TOKEN_OVERRIDES: Record<string, WcuiSnapToken> = {
  USA: "--wcui-primary-blue",
  WAL: "--wcui-primary-red",
  WLS: "--wcui-primary-red",
};

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return null;
  const n = Number.parseInt(normalized, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s, l];
}

function colorDistanceSq(a: [number, number, number], b: [number, number, number]): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function snapAmong(hex: string, tokens: readonly WcuiSnapToken[]): WcuiSnapToken {
  const source = hexToRgb(hex);
  if (!source) return "--wcui-primary-blue";

  let best: WcuiSnapToken = tokens[0];
  let bestDist = Number.POSITIVE_INFINITY;

  for (const token of tokens) {
    const target = hexToRgb(TOKEN_HEX[token]);
    if (!target) continue;
    const dist = colorDistanceSq(source, target);
    if (dist < bestDist) {
      bestDist = dist;
      best = token;
    }
  }

  return best;
}

function isYellowColor(rgb: [number, number, number]): boolean {
  const [h, s, l] = rgbToHsl(rgb);
  return s >= 0.35 && h >= 42 && h <= 88 && l >= 0.3;
}

function isBlueColor(rgb: [number, number, number]): boolean {
  const [h, s] = rgbToHsl(rgb);
  return s >= 0.12 && h >= 185 && h <= 265;
}

function isSkyBlueColor(rgb: [number, number, number]): boolean {
  if (!isBlueColor(rgb)) return false;

  const [, , l] = rgbToHsl(rgb);
  if (l >= 0.52) return true;

  const primaryBlue = hexToRgb(TOKEN_HEX["--wcui-primary-blue"]);
  const skyBlue = hexToRgb("#8db9ff");
  if (!primaryBlue || !skyBlue) return false;
  return colorDistanceSq(rgb, skyBlue) < colorDistanceSq(rgb, primaryBlue);
}

function snapBlueToken(rgb: [number, number, number]): WcuiSnapToken {
  return isSkyBlueColor(rgb) ? "--wcui-aqua-mint" : "--wcui-primary-blue";
}

function getInteriorSourceHex(team: NationalTeam): string {
  if (team.jersey === "White") {
    return team.colors.secondary;
  }
  return team.colors.primary;
}

function resolveInteriorToken(team: NationalTeam): WcuiSnapToken {
  const jerseyToken = JERSEY_INTERIOR_TOKEN[team.jersey];
  if (jerseyToken) {
    return jerseyToken;
  }

  const sourceHex = getInteriorSourceHex(team);
  const rgb = hexToRgb(sourceHex);
  if (!rgb) return "--wcui-primary-blue";

  if (isYellowColor(rgb)) {
    return "--wcui-lime-pulse";
  }

  if (isBlueColor(rgb)) {
    return snapBlueToken(rgb);
  }

  return snapAmong(sourceHex, GENERAL_SNAP_TOKENS);
}

/** CSS `var(--wcui-*)` tint for performer card interior gradient. */
export function getPerformerInteriorTint(countryCode: string): string {
  const fifa = countryToFifa(countryCode);
  const override = INTERIOR_TOKEN_OVERRIDES[fifa];
  if (override) {
    return `var(${override})`;
  }

  const team = getNationalTeam(countryCode);
  if (!team) {
    return "var(--wcui-primary-blue)";
  }

  const token = resolveInteriorToken(team);
  return `var(${token})`;
}
