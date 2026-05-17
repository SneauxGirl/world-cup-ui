import { formatKickoff } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import type { DashboardMatch } from "@/data/types";
import styles from "./MatchCard.module.scss";

type Props = {
  match: DashboardMatch;
};

const accentMap: Record<DashboardMatch["accent"], string> = {
  primaryRed: styles.accentPrimaryRed,
  deepEmerald: styles.accentDeepEmerald,
  primaryBlue: styles.accentPrimaryBlue,
  broadcastOrange: styles.accentBroadcastOrange,
  borderBlue: styles.accentBorderBlue,
};

export function MatchCard({ match }: Props) {
  const statusLabel =
    match.status === "live"
      ? t("dashboard.live")
      : match.status === "upcoming"
        ? t("dashboard.upcoming")
        : "FT";
  const clock =
    match.status === "upcoming" ? formatKickoff(match.clockLabel) : match.clockLabel;

  return (
    <article className={`${styles.cardFrame} ${accentMap[match.accent]}`}>
      <div className={styles.cardInner}>
        <header className={styles.header}>
        <span
          className={match.status === "live" ? styles.badgeLive : styles.badgeMuted}
        >
          {statusLabel}
        </span>
        <span className={styles.clock}>{clock}</span>
      </header>
      <div className={styles.teams}>
        <div className={styles.team}>
          <span className={styles.flag} aria-hidden="true">
            {match.home.flagEmoji}
          </span>
          <span className={styles.code}>{match.home.code}</span>
        </div>
        <div className={styles.scoreWrap}>
          <span className={styles.score}>{match.homeScore}</span>
          <span className={styles.sep} aria-hidden="true">
            –
          </span>
          <span className={styles.score}>{match.awayScore}</span>
        </div>
        <div className={styles.team}>
          <span className={styles.flag} aria-hidden="true">
            {match.away.flagEmoji}
          </span>
          <span className={styles.code}>{match.away.code}</span>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.names}>
          {match.home.name} {t("match.versus")} {match.away.name}
        </span>
        {match.status === "live" ? (
          <span className={styles.pts}>
            {t("dashboard.fantasyPts", { pts: match.fantasyPoints })}
          </span>
        ) : null}
      </div>
      <div className={styles.momentum} aria-hidden="true" />
      </div>
    </article>
  );
}
