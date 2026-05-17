import { IconBall, IconSpark } from "@/components/icons/DashboardIcons";
import { t, tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./StrategyFeedSections.module.scss";

type StrategyProps = {
  text: string;
  className?: string;
};

export function StrategyInsightBlock({ text, className }: StrategyProps) {
  return (
    <section
      className={[styles.strategyFrame, className].filter(Boolean).join(" ")}
      aria-labelledby="strategy-heading"
    >
      <div className={styles.strategy}>
        <div className={styles.strategyIcon} aria-hidden="true">
          <IconSpark />
        </div>
        <div>
          <h2 id="strategy-heading" className={styles.strategyTitle}>
            {t("dashboard.strategyInsight")}
          </h2>
          <p className={styles.strategyBody}>{text}</p>
        </div>
      </div>
    </section>
  );
}

type FeedProps = {
  items: FeedItem[];
  className?: string;
};

export function LiveFeedBlock({ items, className }: FeedProps) {
  return (
    <section
      className={[styles.feedFrame, className].filter(Boolean).join(" ")}
      aria-labelledby="live-feed-heading"
    >
      <div className={styles.feed}>
        <div className={styles.feedHead}>
          <h2 id="live-feed-heading" className={styles.feedTitle}>
            {t("dashboard.liveFeed")}
          </h2>
        </div>
        <ul className={styles.feedList}>
          {items.map((item) => (
            <li key={item.id} className={styles.feedRowFrame}>
              <div className={styles.feedRow}>
                <span className={styles.feedIcon} aria-hidden="true">
                  {item.kind === "ball" ? <IconBall /> : <IconSpark />}
                </span>
                <span className={styles.feedText}>{tFeed(item.messageKey)}</span>
                <span className={styles.feedPts}>
                  {t("dashboard.fantasyPts", { pts: item.pts })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
