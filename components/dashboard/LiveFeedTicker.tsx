"use client";

import { Fragment } from "react";
import { t, tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./LiveFeedTicker.module.scss";

type Props = {
  items: FeedItem[];
  className?: string;
};

function FeedTickerItem({ item }: { item: FeedItem }) {
  return (
    <li className={styles.tickerItem}>
      <span className={styles.tickerMessage}>{tFeed(item.messageKey)}</span>
      <span
        className={styles.tickerPts}
        aria-label={t("dashboard.fantasyPts", { pts: item.pts })}
      >
        +{item.pts}
      </span>
    </li>
  );
}

export function LiveFeedTicker({ items, className }: Props) {
  if (items.length === 0) return null;

  const loopItems = [...items, ...items];

  return (
    <section
      className={[styles.ticker, className].filter(Boolean).join(" ")}
      aria-label={t("dashboard.liveRegionLabel")}
    >
      <div className={styles.tickerViewport}>
        <ul className={styles.tickerTrack}>
          {loopItems.map((item, index) => (
            <Fragment key={`${item.id}-${index}`}>
              {index > 0 ? (
                <li className={styles.tickerSep} aria-hidden="true">
                  |
                </li>
              ) : null}
              <FeedTickerItem item={item} />
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
