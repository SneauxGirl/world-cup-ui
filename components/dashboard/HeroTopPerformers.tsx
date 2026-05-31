import Link from "next/link";
import { PerformerCard } from "@/components/dashboard/PerformerCard";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import type { DashboardPerformer } from "@/data/types";
import styles from "./HeroTopPerformers.module.scss";

const HERO_PERFORMER_LIMIT = 3;

type Props = {
  performers: DashboardPerformer[];
  className?: string;
};

export function HeroTopPerformers({ performers, className }: Props) {
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
          {t("dashboard.topPerformers")}
        </h2>
        <Link className={styles.viewAll} href="/">
          {t("dashboard.viewAllPlayers")}
          <IconChevronRight className={styles.viewIcon} aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.grid}>
        {sortedPerformers.map((performer) => (
          <div key={performer.id} className={styles.slot}>
            <PerformerCard performer={performer} variant="hero" />
          </div>
        ))}
      </div>
    </section>
  );
}
