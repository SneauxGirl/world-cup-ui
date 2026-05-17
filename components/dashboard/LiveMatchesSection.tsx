"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import type { DashboardMatch } from "@/data/types";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import styles from "./LiveMatchesSection.module.scss";

type Props = {
  matches: DashboardMatch[];
  liveSummary: string;
  className?: string;
};

export function LiveMatchesSection({ matches, liveSummary, className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const delta = card ? card.getBoundingClientRect().width + 12 : 280;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(" ")}
      aria-labelledby="live-matches-heading"
    >
      <div className={styles.head}>
        <h2 id="live-matches-heading" className={styles.title}>
          {t("dashboard.liveMatches")}
        </h2>
        <Link className={styles.viewAll} href="/">
          {t("dashboard.viewAllMatches")}
          <IconChevronRight className={styles.viewIcon} />
        </Link>
      </div>
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {liveSummary}
      </p>
      <div className={styles.controls}>
        <span className={styles.navBtnFrame}>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t("dashboard.previousSlide")}
            onClick={() => scrollByCard(-1)}
          >
            <IconChevronRight className={styles.flip} />
          </button>
        </span>
        <span className={styles.navBtnFrame}>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t("dashboard.nextSlide")}
            onClick={() => scrollByCard(1)}
          >
            <IconChevronRight />
          </button>
        </span>
      </div>
      <div ref={scrollerRef} className={styles.scroller}>
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </section>
  );
}
