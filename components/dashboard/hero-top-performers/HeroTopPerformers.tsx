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
  const performerCount = topTrendPerformers.length;

  if (performerCount === 0) return null;

  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")} aria-label={t("valueTrends.highlightsLabel")}>
      <div className={styles.bottomBand}>
        <div
          className={[
            styles.cardRow,
            performerCount === 2 ? styles.cardRowTwo : "",
            performerCount === 1 ? styles.cardRowOne : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {topTrendPerformers.map((performer) => (
            <div key={performer.id} className={styles.slot}>
              <HeroPerformerCard performer={performer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
