import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { DashboardPerformer } from "@/data/types";
import styles from "./PerformerCard.module.scss";

const accentClass: Record<DashboardPerformer["accent"], string> = {
  primaryBlue: styles.accentPrimaryBlue,
  aquaMint: styles.accentAquaMint,
  borderBlue: styles.accentBorderBlue,
  limePulse: styles.accentLimePulse,
};

type Props = {
  performer: DashboardPerformer;
};

export function PerformerCard({ performer }: Props) {
  return (
    <article className={`${styles.cardFrame} ${accentClass[performer.accent]}`}>
      <div className={styles.cardInner}>
        <header className={styles.header}>
        <h3 className={styles.name}>{performer.name}</h3>
        <p className={styles.meta}>
          {t("player.position", {
            team: performer.teamCode,
            pos: performer.position,
          })}
        </p>
      </header>
      <p className={styles.points}>
        {t("player.points", { pts: formatInteger(performer.points) })}
      </p>
      <div className={styles.portrait} aria-hidden="true">
        <div className={styles.portraitSilhouette} />
      </div>
      </div>
    </article>
  );
}
