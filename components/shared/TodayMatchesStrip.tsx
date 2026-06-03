"use client";

import { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { liveMatches } from "@/data/dashboard-seed";
import type { DashboardMatch } from "@/data/types";
import {
  BANNER_DIVIDER_WIDTH_PX,
  BANNER_MIN_GAME_WIDTH_PX,
  buildBannerStripItems,
  countBannerItemsThatFit,
  type BannerStripItem,
} from "@/lib/bannerStripItems";
import { formatKickoffTime } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import { formatTodayStripDateLabel, groupBannerStripByDate } from "@/lib/todayMatches";
import styles from "./TodayMatchesStrip.module.scss";

type MatchStripStatus = {
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

function matchStripStatus(match: DashboardMatch): MatchStripStatus {
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

function matchAriaLabel(match: DashboardMatch, status: MatchStripStatus): string {
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

function StripGame({ match }: { match: DashboardMatch }) {
  const status = matchStripStatus(match);
  const showScores = match.status !== "upcoming";

  const matchLabel = matchAriaLabel(match, status);

  return (
    <article className={styles.game} aria-label={matchLabel}>
      <ul className={styles.teamList} aria-hidden="true">
        <li className={styles.teamRow}>
          <CountryFlag code={match.home.code} className={styles.teamFlag} />
          <span className={styles.teamCode}>{match.home.code}</span>
          <span className={styles.teamScore}>
            {showScores ? match.homeScore : "–"}
          </span>
        </li>
        <li className={styles.teamRow}>
          <CountryFlag code={match.away.code} className={styles.teamFlag} />
          <span className={styles.teamCode}>{match.away.code}</span>
          <span className={styles.teamScore}>
            {showScores ? match.awayScore : "–"}
          </span>
        </li>
      </ul>
      <p
        className={[
          styles.gameStatus,
          status.variant === "live" && styles.gameStatusLive,
          status.variant === "finished" && styles.gameStatusFinished,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
        title={status.tooltip}
      >
        <time dateTime={status.dateTime}>{status.label}</time>
      </p>
    </article>
  );
}

function DateLabel({ dateId }: { dateId: string }) {
  const dateLabel = formatTodayStripDateLabel(dateId);
  return (
    <p className={styles.dateLabel} aria-label={t("todayMatches.dateAria", { date: dateLabel })}>
      <time dateTime={dateId} aria-hidden="true">
        {dateLabel}
      </time>
    </p>
  );
}

function renderStripItem(item: BannerStripItem, previous?: BannerStripItem) {
  switch (item.kind) {
    case "date":
      return <DateLabel dateId={item.dateId} />;
    case "divider":
      return <span className={styles.gameDivider} aria-hidden="true" />;
    case "game": {
      const showDivider = previous?.kind === "game";
      return (
        <div className={styles.gameWrap}>
          {showDivider ? <span className={styles.gameDivider} aria-hidden="true" /> : null}
          <StripGame match={item.match} />
        </div>
      );
    }
    default:
      return null;
  }
}

type Props = {
  className?: string;
};

export function TodayMatchesStrip({ className }: Props) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const dateProbeRef = useRef<HTMLParagraphElement | null>(null);

  const segments = useMemo(() => groupBannerStripByDate(liveMatches), []);
  const allItems = useMemo(() => buildBannerStripItems(segments), [segments]);
  const longestDateId = useMemo(() => {
    const dateIds = allItems.filter((item) => item.kind === "date").map((item) => item.dateId);
    return dateIds.reduce((longest, dateId) => {
      const label = formatTodayStripDateLabel(dateId);
      return label.length > formatTodayStripDateLabel(longest).length ? dateId : longest;
    }, dateIds[0] ?? "2026-06-28");
  }, [allItems]);

  const [visibleCount, setVisibleCount] = useState(allItems.length);

  const measureFit = useCallback(() => {
    const row = rowRef.current;
    const dateProbe = dateProbeRef.current;
    if (!row || !dateProbe) return;

    const available = row.clientWidth;
    const minDate = dateProbe.offsetWidth;
    const count = countBannerItemsThatFit(
      available,
      allItems,
      minDate,
      BANNER_MIN_GAME_WIDTH_PX,
      BANNER_DIVIDER_WIDTH_PX,
    );
    setVisibleCount((current) => (current === count ? current : count));
  }, [allItems]);

  useLayoutEffect(() => {
    measureFit();
    const row = rowRef.current;
    if (!row) return;

    const observer = new ResizeObserver(() => measureFit());
    observer.observe(row);
    window.addEventListener("resize", measureFit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureFit);
    };
  }, [measureFit]);

  const visibleItems = allItems.slice(0, visibleCount);

  if (allItems.length === 0) return null;

  return (
    <section
      className={[styles.strip, className].filter(Boolean).join(" ")}
      aria-label={t("todayMatches.regionLabel")}
    >
      <div className={styles.measureRow} aria-hidden="true">
        <p ref={dateProbeRef} className={styles.dateLabel}>
          {formatTodayStripDateLabel(longestDateId)}
        </p>
      </div>

      <div ref={rowRef} className={styles.row} role="list" aria-label={t("todayMatches.gamesLabel")}>
        {visibleItems.map((item, index) => (
          <Fragment key={stripItemKey(item, index)}>{renderStripItem(item, visibleItems[index - 1])}</Fragment>
        ))}
      </div>
    </section>
  );
}

function stripItemKey(item: BannerStripItem, index: number): string {
  if (item.kind === "date") return `date-${item.dateId}`;
  if (item.kind === "game") return item.match.id;
  return `divider-${index}`;
}
