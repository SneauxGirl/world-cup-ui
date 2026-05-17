import Link from "next/link";
import { PerformerCard } from "@/components/dashboard/PerformerCard";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import type { DashboardPerformer } from "@/data/types";
import styles from "./TopPerformersSection.module.scss";

type Props = {
  performers: DashboardPerformer[];
  className?: string;
};

export function TopPerformersSection({ performers, className }: Props) {
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(" ")}
      aria-labelledby="top-performers-heading"
    >
      <div className={styles.head}>
        <h2 id="top-performers-heading" className={styles.title}>
          {t("dashboard.topPerformers")}
        </h2>
        <Link className={styles.viewAll} href="/">
          {t("dashboard.viewAllPlayers")}
          <IconChevronRight className={styles.viewIcon} />
        </Link>
      </div>
      <div className={styles.grid}>
        {performers.map((p) => (
          <PerformerCard key={p.id} performer={p} />
        ))}
      </div>
    </section>
  );
}
