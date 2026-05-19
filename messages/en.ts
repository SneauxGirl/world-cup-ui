/**
 * English copy — stable keys for future locales.
 * Use `t("section.key")` from @/lib/i18n/t
 */
export const en = {
  app: {
    name: "WCUI",
    tagline: "World Cup 2026",
    worldCupChallenge: "World Cup Challenge",
  },
  nav: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuDialogLabel: "Site navigation",
    dashboard: "Dashboard",
    roster: "My roster",
    matches: "Matches",
    standings: "Standings",
    players: "Players",
    tournament: "Tournament",
    store: "Store",
    settings: "Settings",
    more: "More",
  },
  dashboard: {
    title: "Dashboard",
    welcomeBackGreeting: "Welcome back,",
    liveMatches: "Live matches",
    viewAllMatches: "View all matches",
    topPerformers: "Top performers",
    viewAllPlayers: "View all players",
    rosterHealth: "Roster health",
    strategyInsight: "Strategy insight",
    liveFeed: "Live feed",
    totalPoints: "Total points",
    rank: "Rank",
    eliteManager: "Elite manager",
    globalRank: "Global rank",
    round: "Round",
    live: "Live",
    upcoming: "Upcoming",
    topPercent: "Top {pct}%",
    percentile: "Percentile",
    fantasyPts: "+{pts} pts",
    previousSlide: "Previous match",
    nextSlide: "Next match",
    liveRegionLabel: "Live score updates",
  },
  roster: {
    active: "Active",
    atRisk: "At risk",
    eliminated: "Eliminated",
  },
  match: {
    scorePending: "Score not yet available",
  },
  player: {
    points: "{pts} pts",
    position: "{team} · {pos}",
  },
  feed: {
    mbappeGoal: "Mbappé scores!",
    brazilCleanSheet: "Brazil clean sheet",
    debruyneAssist: "De Bruyne assist",
    argentinaGoal: "Argentina goal",
  },
} as const;

export type Messages = typeof en;
