import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { RosterHealth as RosterHealthModel } from "@/data/types";
import styles from "./RosterHealthSection.module.scss";

type Props = {
  data: RosterHealthModel;
  className?: string;
};

export function RosterHealthSection({ data, className }: Props) {
  return (
    <section
      className={[styles.sectionFrame, className].filter(Boolean).join(" ")}
      aria-labelledby="roster-health-heading"
    >
      <div className={styles.section}>
        <h2 id="roster-health-heading" className={styles.srHeading}>
          {t("dashboard.rosterHealth")}
        </h2>
        <div className={styles.bar}>
        <div className={styles.stat}>
          <span className={styles.label}>{t("roster.active")}</span>
          <span className={styles.value}>{formatInteger(data.active)}</span>
          <span className={styles.underlineActive} aria-hidden="true" />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t("roster.atRisk")}</span>
          <span className={styles.value}>{formatInteger(data.atRisk)}</span>
          <span className={styles.underlineRisk} aria-hidden="true" />
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t("roster.eliminated")}</span>
          <span className={styles.value}>{formatInteger(data.eliminated)}</span>
          <span className={styles.underlineOut} aria-hidden="true" />
        </div>
        </div>
      </div>
    </section>
  );
}
