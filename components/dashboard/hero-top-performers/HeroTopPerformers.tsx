import Link from "next/link";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import type { DashboardPerformer } from "@/data/types";
import { HeroPerformerCard } from "./HeroPerformerCard";
import styles from "./HeroTopPerformers.module.scss";

const HERO_PERFORMER_LIMIT = 3;

type Props = {
  performers: DashboardPerformer[];
  className?: string;
};

export function HeroTopPerformers({ performers, className }: Props) {
  const topTrendPerformers = performers.slice(0, HERO_PERFORMER_LIMIT);

  if (topTrendPerformers.length === 0) return null;

  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")} aria-label={t("valueTrends.highlightsLabel")}>
      <div className={styles.bottomBand}>
        <div className={styles.cardRow}>
          {topTrendPerformers.map((performer) => (
            <div key={performer.id} className={styles.slot}>
              <HeroPerformerCard performer={performer} />
            </div>
          ))}
        </div>
        <div className={styles.foot}>
          <Link className={styles.editRosterLink} href="/roster">
            {t("dashboard.editRoster")}
            <IconChevronRight className={styles.editRosterIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
