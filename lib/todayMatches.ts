import type { DashboardMatch } from "@/data/types";
import {
  FIXTURE_DEMO_TODAY,
  getBannerStripMatches,
  matchesForFixtureDate,
  parseMatchDate,
} from "@/lib/fixtureSchedule";

export function getTodayMatches(matches: DashboardMatch[]): DashboardMatch[] {
  return matchesForFixtureDate(matches, FIXTURE_DEMO_TODAY);
}

export type BannerDateSegment = {
  dateId: string;
  matches: DashboardMatch[];
};

export function groupBannerStripByDate(matches: DashboardMatch[]): BannerDateSegment[] {
  const segments: BannerDateSegment[] = [];

  for (const match of getBannerStripMatches(matches)) {
    const dateId = parseMatchDate(match) ?? FIXTURE_DEMO_TODAY;
    const last = segments[segments.length - 1];
    if (last?.dateId === dateId) {
      last.matches.push(match);
    } else {
      segments.push({ dateId, matches: [match] });
    }
  }

  return segments;
}

const todayDateLabelFmt = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export function formatTodayStripDateLabel(dateId: string = FIXTURE_DEMO_TODAY): string {
  return todayDateLabelFmt.format(new Date(`${dateId}T12:00:00`));
}
