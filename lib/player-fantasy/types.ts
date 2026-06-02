export type PlayerGameLog = {
  minutes: number;
  fantasyPoints: number;
};

export type PlayerSeasonStats = {
  gp: number;
  gs: number;
  mp: number;
  g: number;
  hg: number;
  pkg: number;
  a: number;
  s: number;
  sog: number;
  soff: number;
  off: number;
  ck: number;
  yc: number;
  rc: number;
  yrc: number;
};

export type PlayerFantasyProfile = {
  games: PlayerGameLog[];
  season: PlayerSeasonStats;
  narrative: string;
  totalFantasyPoints: number;
};

export type PlayerFantasyProfileMap = Record<string, PlayerFantasyProfile>;
