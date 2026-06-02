import Link from "next/link";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
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

  if (sortedPerformers.length === 0) return null;

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(" ")}
      aria-labelledby="hero-top-performers-heading"
    >
      <div className={styles.head}>
        <h2 id="hero-top-performers-heading" className={styles.title}>
          {t(
            globalTopPerformers
              ? "dashboard.globalTopPerformers"
              : "dashboard.topPerformers",
          )}
        </h2>
      </div>
      <div className={styles.bottomBand}>
        <div className={styles.cardRow}>
          {sortedPerformers.map((performer) => (
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
