"use client";

import { t, tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./HeroCtaLiveFeed.module.scss";

type Props = {
  items: FeedItem[];
  className?: string;
};

function FeedTickerRow({ item }: { item: FeedItem }) {
  return (
    <li className={styles.row}>
      <span className={styles.message}>{tFeed(item.messageKey)}</span>
      <span
        className={styles.pts}
        aria-label={t("dashboard.fantasyPts", { pts: item.pts })}
      >
        +{item.pts}
      </span>
    </li>
  );
}

export function HeroCtaLiveFeed({ items, className }: Props) {
  if (items.length === 0) return null;

  const loopItems = [...items, ...items];

  return (
    <div className={[styles.ticker, className].filter(Boolean).join(" ")}>
      <div className={styles.viewport}>
        <ul className={styles.track}>
          {loopItems.map((item, index) => (
            <FeedTickerRow key={`${item.id}-${index}`} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
