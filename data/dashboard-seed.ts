import type {
  DashboardMatch,
  DashboardPerformer,
  FeedItem,
  RosterHealth,
  UserDashboard,
} from "@/data/types";

export const userDashboard: UserDashboard = {
  displayName: "Heather Hugo",
  totalPoints: 1248,
  rank: 12458,
  roundLabel: "Round of 16",
  isRoundLive: true,
  topPercent: 1.4,
};

export const rosterHealth: RosterHealth = {
  active: 15,
  atRisk: 3,
  eliminated: 2,
};

export const strategyInsight =
  "France's left side is generating 63% of their attacks — chances cluster on that flank early.";

export const liveMatches: DashboardMatch[] = [
  {
    id: "m1",
    status: "live",
    home: { code: "ARG", name: "Argentina" },
    away: { code: "FRA", name: "France" },
    homeScore: 2,
    awayScore: 1,
    clockLabel: "75′",
    fantasyPoints: 18,
  },
  {
    id: "m2",
    status: "live",
    home: { code: "BRA", name: "Brazil" },
    away: { code: "NED", name: "Netherlands" },
    homeScore: 0,
    awayScore: 0,
    clockLabel: "62′",
    fantasyPoints: 6,
  },
  {
    id: "m3",
    status: "live",
    home: { code: "POR", name: "Portugal" },
    away: { code: "ENG", name: "England" },
    homeScore: 1,
    awayScore: 2,
    clockLabel: "81′",
    fantasyPoints: 22,
  },
  {
    id: "m4",
    status: "upcoming",
    home: { code: "ESP", name: "Spain" },
    away: { code: "GER", name: "Germany" },
    homeScore: 0,
    awayScore: 0,
    clockLabel: "2026-06-28T20:00:00Z",
    fantasyPoints: 0,
  },
];

export const topPerformers: DashboardPerformer[] = [
  {
    id: "p1",
    name: "Mbappé",
    teamCode: "FRA",
    position: "FWD",
    points: 126,
  },
  {
    id: "p2",
    name: "Messi",
    teamCode: "ARG",
    position: "FWD",
    points: 118,
  },
  {
    id: "p3",
    name: "Bellingham",
    teamCode: "ENG",
    position: "MID",
    points: 112,
  },
  {
    id: "p4",
    name: "Vinícius Jr.",
    teamCode: "BRA",
    position: "FWD",
    points: 108,
  },
];

export const feedItems: FeedItem[] = [
  { id: "f1", messageKey: "mbappeGoal", pts: 12, kind: "ball" },
  {
    id: "f2",
    messageKey: "brazilCleanSheet",
    pts: 6,
    kind: "flag",
    flagCode: "BRA",
  },
  { id: "f3", messageKey: "debruyneAssist", pts: 8, kind: "badge" },
  {
    id: "f4",
    messageKey: "argentinaGoal",
    pts: 10,
    kind: "flag",
    flagCode: "ARG",
  },
];
