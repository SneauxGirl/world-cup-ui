"use client";

import { useCallback, useRef } from "react";
import { FeedCard } from "@/components/dashboard/FeedCard";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import type { FeedItem } from "@/data/types";
import { t } from "@/lib/i18n/t";
import styles from "./LiveMatchesSection.module.scss";

type Props = {
  items: FeedItem[];
  className?: string;
};

export function LiveMatchesSection({ items, className }: Props) {
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
      aria-labelledby="live-feed-heading"
    >
      <div className={styles.head}>
        <h2 id="live-feed-heading" className={styles.title}>
          {t("dashboard.liveFeed")}
        </h2>
      </div>
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
        {items.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
