import type { DashboardMatch } from "@/data/types";
import { formatKickoffTime } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";

export type MatchStripStatus = {
  label: string;
  dateTime?: string;
  variant: "live" | "upcoming" | "finished";
  tooltip?: string;
};

function parseLiveMinutes(clockLabel: string): number | null {
  const match = clockLabel.match(/^(\d+)/);
  if (!match) return null;
  const minutes = Number(match[1]);
  return Number.isFinite(minutes) ? minutes : null;
}

export function matchStripStatus(match: DashboardMatch): MatchStripStatus {
  if (match.status === "live") {
    const liveMinutes = parseLiveMinutes(match.clockLabel);
    return {
      label: t("todayMatches.liveStatus", { clock: match.clockLabel }),
      variant: "live",
      tooltip:
        liveMinutes != null
          ? t("todayMatches.liveMinutesTooltip", { minutes: liveMinutes })
          : undefined,
    };
  }
  if (match.status === "finished") {
    return { label: t("todayMatches.final"), variant: "finished" };
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(match.clockLabel)) {
    return {
      label: formatKickoffTime(match.clockLabel),
      dateTime: match.clockLabel,
      variant: "upcoming",
    };
  }
  return { label: match.clockLabel, variant: "upcoming" };
}

export function matchAriaLabel(match: DashboardMatch, status: MatchStripStatus): string {
  if (match.status === "live") {
    const liveMinutes = parseLiveMinutes(match.clockLabel);
    if (liveMinutes != null) {
      return t("todayMatches.matchAriaLive", {
        home: match.home.name,
        away: match.away.name,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        minutes: liveMinutes,
      });
    }
    return t("todayMatches.matchAriaLiveClock", {
      home: match.home.name,
      away: match.away.name,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      clock: match.clockLabel,
    });
  }
  if (match.status === "finished") {
    return t("todayMatches.matchAriaFinished", {
      home: match.home.name,
      away: match.away.name,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    });
  }
  const kickoff =
    status.dateTime != null ? formatKickoffTime(status.dateTime) : status.label;
  return t("todayMatches.matchAriaUpcoming", {
    home: match.home.name,
    away: match.away.name,
    kickoff,
  });
}
