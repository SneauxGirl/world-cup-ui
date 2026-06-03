import { t } from "@/lib/i18n/t";
import type { DashboardPerformer } from "@/data/types";
import { HeroPerformerCard } from "./HeroPerformerCard";
import styles from "./HeroTopPerformers.module.scss";

const HERO_PERFORMER_LIMIT = 3;

type Props = {
  performers: DashboardPerformer[];
  /** When true, heading uses global pool copy (fewer than 3 roster picks). */
  globalTopPerformers?: boolean;
  className?: string;
};

export function HeroTopPerformers({
  performers,
  globalTopPerformers = false,
  className,
}: Props) {
  const sortedPerformers = [...performers]
    .sort((a, b) => b.points - a.points)
    .slice(0, HERO_PERFORMER_LIMIT);
  const performerCount = sortedPerformers.length;

  if (performerCount === 0) return null;

  const pluralKey = globalTopPerformers
    ? "dashboard.globalTopPerformers"
    : "dashboard.topPerformers";
  const singularKey = globalTopPerformers
    ? "dashboard.globalTopPerformer"
    : "dashboard.topPerformer";

  return (
    <section
      className={[
        styles.section,
        performerCount === 1 ? styles.sectionOneUp : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="hero-top-performers-heading"
    >
      <div className={styles.head}>
        <h2 id="hero-top-performers-heading" className={styles.title}>
          <span className={styles.titleLabelPlural}>{t(pluralKey)}</span>
          <span className={styles.titleLabelSingular}>{t(singularKey)}</span>
        </h2>
      </div>
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
          {sortedPerformers.map((performer) => (
            <div key={performer.id} className={styles.slot}>
              <HeroPerformerCard performer={performer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
