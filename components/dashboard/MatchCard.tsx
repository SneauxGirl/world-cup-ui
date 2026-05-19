"use client";

import { CountryFlag } from "@/components/CountryFlag";
import { useMatchBorderAccent } from "@/hooks/useMatchBorderAccent";
import { formatKickoff } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import type { MatchBorderAccent } from "@/lib/matchBorderAccent";
import type { DashboardMatch } from "@/data/types";
import styles from "./MatchCard.module.scss";

type Props = {
  match: DashboardMatch;
};

const accentMap: Record<MatchBorderAccent, string | undefined> = {
  primaryRed: styles.accentPrimaryRed,
  aquaMint: undefined,
  borderBlue: styles.accentBorderBlue,
};

export function MatchCard({ match }: Props) {
  const borderAccent = useMatchBorderAccent(match);
  const isUpcoming = match.status === "upcoming";
  const statusLabel =
    match.status === "live"
      ? t("dashboard.live")
      : isUpcoming
        ? t("dashboard.upcoming")
        : "FT";
  const clock = isUpcoming ? formatKickoff(match.clockLabel) : match.clockLabel;
  const useStadiumGradient = borderAccent === "aquaMint";

  return (
    <article
      className={[
        styles.cardFrame,
        useStadiumGradient ? styles.cardFrameStadium : accentMap[borderAccent],
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[styles.cardInner, useStadiumGradient && styles.cardInnerStadium]
          .filter(Boolean)
          .join(" ")}
      >
        <header className={styles.header}>
          <span
            className={
              match.status === "live"
                ? [
                    styles.badgeLive,
                    borderAccent === "primaryRed" && styles.badgeLiveGoal,
                  ]
                    .filter(Boolean)
                    .join(" ")
                : styles.badgeMuted
            }
          >
            {statusLabel}
          </span>
          {!isUpcoming ? <span className={styles.clock}>{clock}</span> : null}
        </header>
        <div className={styles.teams}>
          <div className={styles.team}>
            <CountryFlag code={match.home.code} label={match.home.code} />
            <span className={styles.code}>{match.home.code}</span>
          </div>
          <div className={styles.scoreWrap}>
            {isUpcoming ? (
              <span className={styles.scoreDash} aria-label={t("match.scorePending")}>
                –
              </span>
            ) : (
              <>
                <span className={styles.score}>{match.homeScore}</span>
                <span className={styles.sep} aria-hidden="true">
                  –
                </span>
                <span className={styles.score}>{match.awayScore}</span>
              </>
            )}
          </div>
          <div className={styles.team}>
            <CountryFlag code={match.away.code} label={match.away.code} />
            <span className={styles.code}>{match.away.code}</span>
          </div>
        </div>
        {isUpcoming ? <p className={styles.kickoff}>{clock}</p> : null}
        {match.status === "live" ? (
          <div className={styles.meta}>
            <span className={styles.pts}>
              {t("dashboard.fantasyPts", { pts: match.fantasyPoints })}
            </span>
          </div>
        ) : null}
        {!isUpcoming ? <div className={styles.momentum} aria-hidden="true" /> : null}
      </div>
    </article>
  );
}
