"use client";

import { useCallback, useMemo, useRef } from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { IconBall, IconChevronDown, IconSpark } from "@/components/icons/DashboardIcons";
import { t, tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./HeroLiveFeed.module.scss";

type Props = {
  items: FeedItem[];
  className?: string;
};

export function HeroLiveFeed({ items, className }: Props) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const orderedItems = useMemo(() => [...items].reverse(), [items]);

  const scrollByRow = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const row = el.querySelector("li");
    const gap = 6;
    const delta = row ? row.getBoundingClientRect().height + gap : 40;
    el.scrollBy({ top: dir * delta, behavior: "smooth" });
  }, []);

  return (
    <div
      className={[styles.feedPanel, className].filter(Boolean).join(" ")}
      aria-labelledby="hero-live-feed-heading"
    >
      <h2 id="hero-live-feed-heading" className={styles.feedTitle}>
        {t("dashboard.liveFeed")}
      </h2>
      <div className={styles.feedBody}>
        <ul ref={scrollerRef} className={styles.feedList}>
          {orderedItems.map((item) => (
            <li key={item.id} className={styles.feedRow}>
              <span className={styles.feedIcon} aria-hidden="true">
                {item.kind === "ball" ? (
                  <IconBall />
                ) : item.kind === "flag" && item.flagCode ? (
                  <CountryFlag code={item.flagCode} />
                ) : (
                  <IconSpark />
                )}
              </span>
              <span className={styles.feedText}>{tFeed(item.messageKey)}</span>
              <span className={styles.feedPts}>{t("dashboard.fantasyPts", { pts: item.pts })}</span>
            </li>
          ))}
        </ul>
        <div className={styles.feedNav}>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t("dashboard.feedScrollUp")}
            onClick={() => scrollByRow(-1)}
          >
            <IconChevronDown className={styles.chevronUp} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            aria-label={t("dashboard.feedScrollDown")}
            onClick={() => scrollByRow(1)}
          >
            <IconChevronDown aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
