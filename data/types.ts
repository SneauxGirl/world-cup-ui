export type FifaCountryCode = string;

export type MatchStatus = "live" | "upcoming" | "finished";

export type FeedMessageKey =
  | "alvarezGoal"
  | "griezmannAssist"
  | "brazilCleanSheet"
  | "virgilBlock"
  | "kaneGoal"
  | "bellinghamAssist"
  | "ronaldoShot"
  | "fodenChance"
  | "riceTackle"
  | "brunoFernandesCorner"
  | "walkerClearance";

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
