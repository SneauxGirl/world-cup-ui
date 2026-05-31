export type FifaCountryCode = string;

export type MatchStatus = "live" | "upcoming" | "finished";

export type FeedMessageKey =
  | "kaneGoal"
  | "bellinghamAssist"
  | "ronaldoShot"
  | "musialaShot"
  | "deBruyneKeyPass"
  | "hakimiCross"
  | "brunoFernandesCorner"
  | "haalandGoal"
  | "modricAssist"
  | "brazilCleanSheet"
  | "virgilBlock";

export type DashboardMatch = {
  id: string;
  status: MatchStatus;
  home: { code: FifaCountryCode; name: string };
  away: { code: FifaCountryCode; name: string };
  homeScore: number;
  awayScore: number;
  clockLabel: string;
  fantasyPoints: number;
  /** Chronological slot on the match day (lower = earlier kickoff). */
  kickoffOrder?: number;
  /** ISO time of the latest goal; triggers a short red border flash while live. */
  lastGoalAt?: string;
};

export type DashboardPerformer = {
  id: string;
  name: string;
  teamCode: FifaCountryCode;
  position: string;
  points: number;
};

export type RosterHealth = {
  active: number;
  atRisk: number;
  eliminated: number;
};

export type FeedItem = {
  id: string;
  messageKey: FeedMessageKey;
  pts: number;
  kind: "ball" | "flag" | "badge";
  flagCode?: FifaCountryCode;
};

export type UserDashboard = {
  displayName: string;
  totalPoints: number;
  rank: number;
  roundLabel: string;
  isRoundLive: boolean;
  topPercent: number;
};

/** One rolling five-game window (e.g. games 1–5, 2–6). */
export type ValueTrendCandle = {
  windowIndex: number;
  gameStart: number;
  gameEnd: number;
  open: number;
  high: number;
  low: number;
  close: number;
  minutesPlayed: number;
};

export type ValueTrendStatKey =
  | "goalThreat"
  | "form"
  | "matchup"
  | "minutes"
  | "saves"
  | "cleanSheets";

export type ValueTrendKeyStat = {
  labelKey: ValueTrendStatKey;
  value: number;
  max: number;
};

export type ValueTrendTrend = "bullish" | "bearish" | "elite";

/** Position-slot mock profile — not tied to a real player until roster assigns one. */
export type ValueTrendTemplate = {
  rollingAverage: number;
  candles: ValueTrendCandle[];
  lastFiveMatchPoints: number[];
  keyStats: ValueTrendKeyStat[];
  expectedPoints: number;
  /** MVP-only insight copy (not wired to i18n). */
  insightLines: string[];
};

/** Persisted roster: pitch slot id → squad pool player id. */
export type UserRosterMap = Record<string, string>;
