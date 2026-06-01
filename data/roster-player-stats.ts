import type { RosterPlayerSeasonStats, RosterPlayerStatKey } from "@/data/types";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";

export const ROSTER_STAT_KEYS: RosterPlayerStatKey[] = [
  "gp",
  "gs",
  "mp",
  "g",
  "hg",
  "pkg",
  "a",
  "s",
  "sog",
  "soff",
  "off",
  "ck",
  "yc",
  "rc",
  "yrc",
];

/** Primary highlight column in the comparison table. */
export const ROSTER_STAT_HIGHLIGHT_KEY: RosterPlayerStatKey = "g";

function line(
  gp: number,
  gs: number,
  mp: number,
  g: number,
  hg: number,
  pkg: number,
  a: number,
  s: number,
  sog: number,
  soff: number,
  off: number,
  ck: number,
  yc: number,
  rc: number,
  yrc: number,
): RosterPlayerSeasonStats {
  return { gp, gs, mp, g, hg, pkg, a, s, sog, soff, off, ck, yc, rc, yrc };
}

/** Mock tournament stats keyed by squad pool player id. */
export const ROSTER_PLAYER_STATS_BY_ID: Record<string, RosterPlayerSeasonStats> = {
  "france-fw-kylian-mbappe": line(7, 7, 597, 8, 1, 2, 2, 28, 13, 5, 6, 5, 0, 0, 0),
  "argentina-fw-lionel-messi": line(7, 7, 690, 7, 0, 4, 3, 31, 17, 11, 3, 20, 1, 0, 0),
  "argentina-fw-julian-alvarez": line(7, 7, 466, 4, 0, 0, 0, 11, 8, 1, 5, 0, 0, 0, 0),
  "france-fw-olivier-giroud": line(6, 6, 424, 4, 1, 0, 0, 16, 6, 10, 2, 0, 1, 0, 0),
  "ecuador-fw-enner-valencia": line(3, 3, 257, 3, 1, 1, 0, 9, 4, 0, 2, 0, 0, 0, 0),
  "netherlands-fw-cody-gakpo": line(5, 5, 454, 3, 1, 0, 0, 6, 3, 0, 3, 16, 0, 0, 0),
  "england-fw-bukayo-saka": line(4, 4, 291, 3, 0, 0, 0, 7, 5, 2, 2, 0, 0, 0, 0),
  "spain-fw-alvaro-morata": line(4, 4, 183, 3, 1, 0, 1, 8, 5, 3, 5, 0, 0, 0, 0),
  "brazil-fw-richarlison": line(4, 4, 326, 3, 0, 0, 0, 6, 4, 1, 1, 0, 0, 0, 0),
  "portugal-fw-goncalo-ramos": line(4, 4, 153, 3, 0, 0, 1, 6, 5, 1, 3, 0, 0, 0, 0),
  "england-fw-marcus-rashford": line(5, 5, 138, 3, 0, 0, 0, 11, 6, 3, 1, 0, 0, 0, 0),
  "netherlands-fw-wout-weghorst": line(4, 4, 61, 2, 1, 0, 0, 2, 2, 0, 1, 0, 1, 0, 0),
  "england-fw-harry-kane": line(5, 5, 402, 2, 0, 1, 3, 10, 6, 2, 0, 0, 0, 0, 0),
  "iran-fw-mehdi-taremi": line(3, 3, 270, 2, 0, 1, 1, 4, 2, 1, 2, 0, 0, 0, 0),
  "poland-fw-robert-lewandowski": line(4, 4, 360, 2, 0, 1, 1, 11, 4, 4, 0, 0, 0, 0, 0),
  "saudi-arabia-fw-salem-al-dawsari": line(3, 3, 270, 2, 0, 0, 0, 6, 4, 2, 1, 2, 1, 0, 0),
  "germany-fw-kai-havertz": line(2, 2, 103, 2, 0, 0, 0, 4, 2, 2, 3, 0, 0, 0, 0),
  "spain-fw-ferran-torres": line(4, 4, 219, 2, 0, 1, 0, 5, 2, 0, 2, 0, 0, 0, 0),
  "japan-fw-ritsu-doan": line(4, 4, 218, 2, 0, 0, 0, 3, 3, 0, 0, 5, 0, 0, 0),
  "croatia-fw-andrej-kramaric": line(7, 7, 481, 2, 0, 0, 0, 11, 5, 2, 2, 0, 0, 0, 0),
  "morocco-fw-youssef-en-nesyri": line(7, 7, 547, 2, 1, 0, 0, 8, 3, 4, 4, 0, 0, 0, 0),
  "switzerland-fw-breel-embolo": line(4, 4, 327, 2, 0, 0, 0, 6, 3, 1, 2, 0, 0, 0, 0),
  "serbia-fw-aleksandar-mitrovic": line(3, 3, 263, 2, 1, 0, 0, 11, 5, 4, 1, 0, 1, 0, 0),
  "brazil-fw-neymar": line(3, 3, 279, 2, 0, 1, 1, 12, 9, 1, 2, 9, 0, 0, 0),
  "cameroon-fw-vincent-aboubakar": line(3, 3, 141, 2, 1, 0, 1, 6, 3, 1, 0, 0, 0, 0, 1),
  "argentina-gk-emiliano-martinez": line(7, 7, 630, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0),
  "brazil-gk-alisson": line(7, 7, 630, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  "morocco-df-achraf-hakimi": line(6, 6, 540, 1, 0, 0, 2, 4, 2, 1, 3, 8, 1, 0, 0),
  "canada-df-alphonso-davies": line(5, 5, 450, 0, 0, 0, 3, 6, 3, 2, 5, 12, 2, 0, 0),
  "croatia-df-josko-gvardiol": line(6, 6, 520, 1, 1, 0, 0, 5, 2, 2, 1, 2, 3, 0, 0),
  "france-df-theo-hernandez": line(5, 5, 410, 0, 0, 0, 4, 7, 4, 2, 4, 15, 2, 0, 0),
  "netherlands-df-virgil-van-dijk": line(7, 7, 630, 2, 2, 0, 0, 8, 4, 3, 2, 0, 2, 0, 0),
  "england-mf-jude-bellingham": line(7, 7, 610, 3, 0, 0, 2, 14, 8, 5, 3, 4, 2, 0, 0),
  "spain-mf-rodri": line(6, 6, 540, 1, 0, 0, 1, 6, 3, 2, 1, 1, 4, 0, 0),
  "germany-mf-jamal-musiala": line(5, 5, 380, 2, 0, 0, 3, 9, 5, 3, 2, 6, 1, 0, 0),
  "belgium-mf-kevin-de-bruyne": line(4, 4, 290, 1, 0, 0, 5, 8, 4, 3, 0, 18, 1, 0, 0),
  "portugal-mf-bruno-fernandes": line(6, 6, 480, 2, 0, 1, 4, 12, 6, 5, 2, 22, 3, 0, 0),
  "norway-fw-erling-haaland": line(5, 5, 420, 5, 1, 2, 1, 18, 11, 6, 4, 0, 1, 0, 0),
  "egypt-fw-mohamed-salah": line(4, 4, 360, 4, 0, 1, 2, 11, 7, 3, 3, 0, 0, 0, 0),
  "south-korea-fw-heung-min-son": line(5, 5, 400, 3, 0, 0, 2, 10, 6, 3, 2, 7, 1, 0, 0),
};

const POSITION_ORDER: Record<SquadPositionCode, number> = {
  GKP: 0,
  DEF: 1,
  MID: 2,
  FWD: 3,
};

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(seed: number, min: number, max: number): number {
  if (max <= min) return min;
  return min + (seed % (max - min + 1));
}

/** Stable mock stats for any squad player not in the seed map. */
export function generateRosterPlayerStats(
  playerId: string,
  position: SquadPositionCode,
): RosterPlayerSeasonStats {
  const seed = hashId(playerId);
  const gp = pick(seed, 2, 7);
  const gs = pick(seed >> 3, 1, gp);
  const mp = pick(seed >> 5, gs * 45, gp * 95);

  if (position === "GKP") {
    return line(gp, gs, mp, 0, 0, 0, 0, 0, 0, 0, 0, 0, pick(seed >> 7, 0, 2), 0, 0);
  }

  if (position === "DEF") {
    const g = pick(seed >> 7, 0, 2);
    const a = pick(seed >> 9, 0, 4);
    const s = pick(seed >> 11, 2, 12);
    const sog = pick(seed >> 13, 1, Math.max(1, s - 2));
    return line(
      gp,
      gs,
      mp,
      g,
      pick(seed >> 15, 0, g),
      0,
      a,
      s,
      sog,
      Math.max(0, s - sog),
      pick(seed >> 17, 0, 5),
      pick(seed >> 19, 0, 14),
      pick(seed >> 21, 0, 3),
      0,
      0,
    );
  }

  if (position === "MID") {
    const g = pick(seed >> 7, 0, 3);
    const a = pick(seed >> 9, 0, 5);
    const s = pick(seed >> 11, 3, 16);
    const sog = pick(seed >> 13, 1, Math.max(1, s - 1));
    return line(
      gp,
      gs,
      mp,
      g,
      0,
      pick(seed >> 15, 0, 1),
      a,
      s,
      sog,
      Math.max(0, s - sog),
      pick(seed >> 17, 0, 4),
      pick(seed >> 19, 0, 20),
      pick(seed >> 21, 0, 4),
      0,
      0,
    );
  }

  const g = pick(seed >> 7, 1, 6);
  const s = pick(seed >> 11, 4, 22);
  const sog = pick(seed >> 13, 2, Math.max(2, s - 2));
  return line(
    gp,
    gs,
    mp,
    g,
    pick(seed >> 15, 0, Math.min(2, g)),
    pick(seed >> 17, 0, 2),
    pick(seed >> 9, 0, 3),
    s,
    sog,
    Math.max(0, s - sog),
    pick(seed >> 19, 0, 6),
    pick(seed >> 21, 0, 8),
    pick(seed >> 23, 0, 2),
    0,
    pick(seed >> 25, 0, 1),
  );
}

export function getRosterPlayerStats(
  playerId: string,
  position: SquadPositionCode,
): RosterPlayerSeasonStats {
  return ROSTER_PLAYER_STATS_BY_ID[playerId] ?? generateRosterPlayerStats(playerId, position);
}

export function compareRosterPlayers(
  a: { position: SquadPositionCode; stats: RosterPlayerSeasonStats },
  b: { position: SquadPositionCode; stats: RosterPlayerSeasonStats },
): number {
  const pos = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
  if (pos !== 0) return pos;
  return b.stats.g - a.stats.g;
}

export function formatStatCell(value: number): string {
  return value === 0 ? "—" : String(value);
}
