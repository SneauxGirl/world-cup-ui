import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./HeroManagerStats.module.scss";

type Props = {
  totalPoints: number;
  rank: number;
  topPercent: number;
  className?: string;
};

export function HeroManagerStats({ totalPoints, rank, topPercent, className }: Props) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      <div className={styles.column} aria-label={t("dashboard.totalPointsLabel")}>
        <p className={styles.eyebrow}>{t("dashboard.totalPointsLabel")}</p>
        <p className={styles.valueMuted}>{formatInteger(totalPoints)}</p>
        <p className={styles.subline}>{t("dashboard.eliteManager")}</p>
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.column} aria-label={t("dashboard.globalRank")}>
        <p className={styles.eyebrow}>{t("dashboard.globalRank")}</p>
        <p className={styles.valueRank}>{formatInteger(rank)}</p>
        <p className={styles.percent}>{t("dashboard.topPercent", { pct: topPercent })}</p>
      </div>
    </div>
  );
}
