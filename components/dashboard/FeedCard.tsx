"use client";

import { CountryFlag } from "@/components/CountryFlag";
import { IconBall, IconSpark } from "@/components/icons/DashboardIcons";
import { t, tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./MatchCard.module.scss";

type Props = {
  item: FeedItem;
};

export function FeedCard({ item }: Props) {
  return (
    <article className={styles.cardFrame}>
      <div className={styles.cardInner}>
        <header className={styles.feedHeader}>
          <span className={styles.ptsHeader}>
            {t("dashboard.fantasyPts", { pts: item.pts })}
          </span>
        </header>
        <div className={styles.feedBody}>
          <span className={styles.feedIcon} aria-hidden="true">
            {item.kind === "ball" ? (
              <IconBall />
            ) : item.kind === "flag" && item.flagCode ? (
              <CountryFlag code={item.flagCode} className={styles.feedFlag} />
            ) : (
              <IconSpark />
            )}
          </span>
          <p className={styles.feedMessage}>{tFeed(item.messageKey)}</p>
        </div>
      </div>
    </article>
  );
}
