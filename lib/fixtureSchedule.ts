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

function parseMatchDate(match: DashboardMatch): string | null {
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

export function matchesForFixtureDate(
  matches: DashboardMatch[],
  dateId: string,
): DashboardMatch[] {
  return matches
    .filter((match) => parseMatchDate(match) === dateId)
    .sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (b.status === "live" && a.status !== "live") return 1;
      return a.clockLabel.localeCompare(b.clockLabel);
    });
}

export function defaultFixtureDateIndex(dates: FixtureDateOption[]): number {
  const preferred = dates.findIndex((date) => date.id === FIXTURE_DEMO_TODAY);
  return preferred >= 0 ? preferred : 0;
}
