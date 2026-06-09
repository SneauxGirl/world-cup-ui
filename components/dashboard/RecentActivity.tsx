"use client";

import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import { IconChevronDown, IconChevronUp } from "@/components/icons/DashboardIcons";
import { RECENT_ACTIVITY_INITIAL_VISIBLE } from "@/lib/dashboard/recentActivity";
import { useRoster } from "@/lib/roster/RosterProvider";
import { t } from "@/lib/i18n/t";
import type { RosterFeedDisplayItem } from "@/data/types";
import styles from "./RecentActivity.module.scss";

type Props = {
  items: RosterFeedDisplayItem[];
  className?: string;
  /** Fixed number of rows shown; list scrolls one row at a time when longer. */
  windowSize?: number;
};

export function RecentActivity({
  items,
  className,
  windowSize = RECENT_ACTIVITY_INITIAL_VISIBLE,
}: Props) {
  const { isDemoMode } = useRoster();
  const hintId = useId();
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setStartIndex((index) => {
      const maxStart = Math.max(0, items.length - windowSize);
      return Math.min(index, maxStart);
    });
  }, [items, windowSize]);

  const showNext = useCallback(() => {
    setStartIndex((index) =>
      Math.min(Math.max(0, items.length - windowSize), index + 1),
    );
  }, [items.length, windowSize]);

  const showPrevious = useCallback(() => {
    setStartIndex((index) => Math.max(0, index - 1));
  }, []);

  const handleContentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const maxStart = Math.max(0, items.length - windowSize);

      switch (event.key) {
        case "ArrowDown":
          if (startIndex >= maxStart) return;
          event.preventDefault();
          showNext();
          break;
        case "ArrowUp":
          if (startIndex <= 0) return;
          event.preventDefault();
          showPrevious();
          break;
        default:
          break;
      }
    },
    [items.length, windowSize, showNext, showPrevious, startIndex],
  );

  if (items.length === 0) return null;

  const visibleItems = items.slice(startIndex, startIndex + windowSize);
  const canScrollUp = startIndex > 0;
  const canScrollDown = startIndex + windowSize < items.length;
  const showChevrons = items.length > windowSize;

  return (
    <section
      className={[styles.activity, isDemoMode && styles.activityDemo, className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="recent-activity-heading"
    >
      <div className={styles.content} inert={isDemoMode ? true : undefined}>
        <h2 id="recent-activity-heading" className={styles.title}>
          {t("dashboard.recentActivity")}
        </h2>
        <div
          className={styles.body}
          data-recent-activity-content
          role="region"
          tabIndex={0}
          aria-label={t("dashboard.recentActivity")}
          aria-describedby={showChevrons ? hintId : undefined}
          onKeyDown={handleContentKeyDown}
        >
          {showChevrons ? (
            <p id={hintId} className={styles.keyboardHint}>
              {t("dashboard.recentActivityKeyboardHint")}
            </p>
          ) : null}
          <div className={styles.bodyInner}>
            <ul className={styles.list}>
              {visibleItems.map((item) => (
                <li key={item.id} className={styles.row}>
                  <span className={styles.text}>{item.message}</span>
                  <span className={styles.pts}>{t("dashboard.fantasyPts", { pts: item.pts })}</span>
                </li>
              ))}
            </ul>
            {showChevrons ? (
              <div className={styles.footerChevrons}>
                <button
                  type="button"
                  className={styles.chevronBtn}
                  aria-label={t("dashboard.recentActivityShowPrevious")}
                  disabled={!canScrollUp}
                  onClick={showPrevious}
                >
                  <IconChevronUp className={styles.chevronIcon} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.chevronBtn}
                  aria-label={t("dashboard.recentActivityShowNext")}
                  disabled={!canScrollDown}
                  onClick={showNext}
                >
                  <IconChevronDown className={styles.chevronIcon} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
