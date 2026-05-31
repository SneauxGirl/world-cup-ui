import type { DashboardMatch } from "@/data/types";

/** Demo “today” for live fixtures in seed data (matches without ISO kickoff). */
export const FIXTURE_DEMO_TODAY = "2026-06-28";

export type FixtureDateOption = {
  id: string;
  weekdayLabel: string;
  dayLabel: string;
  monthLabel: string;
  yearLabel: string;
};

const weekdayFmt = new Intl.DateTimeFormat("en", { weekday: "short" });
const dayFmt = new Intl.DateTimeFormat("en", { day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("en", { month: "long" });
const yearFmt = new Intl.DateTimeFormat("en", { year: "numeric" });

export function parseMatchDate(match: DashboardMatch): string | null {
  if (match.status === "upcoming" && /^\d{4}-\d{2}-\d{2}T/.test(match.clockLabel)) {
    return match.clockLabel.slice(0, 10);
  }
  if (match.status === "live" || match.status === "finished") {
    return FIXTURE_DEMO_TODAY;
  }
  return null;
}

function toFixtureDateOption(dateId: string): FixtureDateOption {
  const date = new Date(`${dateId}T12:00:00`);
  return {
    id: dateId,
    weekdayLabel: weekdayFmt.format(date),
    dayLabel: dayFmt.format(date),
    monthLabel: monthFmt.format(date),
    yearLabel: yearFmt.format(date),
  };
}

export function buildFixtureDates(matches: DashboardMatch[]): FixtureDateOption[] {
  const ids = [
    ...new Set(
      matches
        .map(parseMatchDate)
        .filter((value): value is string => value !== null),
    ),
  ].sort();

  return ids.map(toFixtureDateOption);
}

function compareMatchesOnSameDay(a: DashboardMatch, b: DashboardMatch): number {
  if (a.kickoffOrder != null && b.kickoffOrder != null) {
    return a.kickoffOrder - b.kickoffOrder;
  }
  if (a.kickoffOrder != null) return -1;
  if (b.kickoffOrder != null) return 1;

  if (a.status === "upcoming" && b.status === "upcoming") {
    return a.clockLabel.localeCompare(b.clockLabel);
  }

  return a.clockLabel.localeCompare(b.clockLabel);
}

export function matchesForFixtureDate(
  matches: DashboardMatch[],
  dateId: string,
): DashboardMatch[] {
  return matches
    .filter((match) => parseMatchDate(match) === dateId)
    .sort(compareMatchesOnSameDay);
}

export function defaultFixtureDateIndex(dates: FixtureDateOption[]): number {
  const preferred = dates.findIndex((date) => date.id === FIXTURE_DEMO_TODAY);
  return preferred >= 0 ? preferred : 0;
}

function compareBannerMatches(a: DashboardMatch, b: DashboardMatch): number {
  const dateA = parseMatchDate(a) ?? "";
  const dateB = parseMatchDate(b) ?? "";
  if (dateA !== dateB) return dateA.localeCompare(dateB);
  return compareMatchesOnSameDay(a, b);
}

/** Today’s fixtures first, then upcoming matches on later dates (for the header banner). */
export function getBannerStripMatches(matches: DashboardMatch[]): DashboardMatch[] {
  return matches
    .filter((match) => {
      const dateId = parseMatchDate(match);
      return dateId !== null && dateId >= FIXTURE_DEMO_TODAY;
    })
    .sort(compareBannerMatches);
}
