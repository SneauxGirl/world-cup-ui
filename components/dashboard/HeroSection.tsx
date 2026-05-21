import Image from "next/image";
import { HeroNavMenu } from "@/components/dashboard/HeroNavMenu";
import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { UserDashboard } from "@/data/types";
import styles from "./HeroSection.module.scss";

type Props = {
  user: UserDashboard;
  className?: string;
};

export function HeroSection({ user, className }: Props) {
  return (
    <section
      className={[styles.hero, className].filter(Boolean).join(" ")}
      aria-labelledby="dashboard-hero-heading"
    >
      <div className={styles.heroPhotoShell} aria-hidden="true">
        <div className={styles.heroMedia}>
          <Image
            src="/SoccerHero1800final.png"
            alt=""
            fill
            priority
            className={styles.heroPhoto}
            sizes="100vw"
          />
        </div>
      </div>
      <div className={styles.heroStack}>
        <div className={styles.heroLayout}>
          <div className={styles.heroTopRow}>
            <p className={styles.kicker}>{t("app.worldCupChallenge")}</p>
            <div className={styles.heroMenu}>
              <HeroNavMenu />
            </div>
          </div>
          <div className={styles.heroStackGrow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <h1 id="dashboard-hero-heading" className={styles.title}>
              <span className={styles.titleGreeting}>{t("dashboard.welcomeBackGreeting")}</span>
              <span className={styles.titleName}>{user.displayName}</span>
            </h1>
            <div className={styles.statsCardFrame}>
              <div className={styles.statsCardInner}>
                <div className={styles.statsLayout}>
                  <div className={styles.statPoints}>
                    <span className={styles.statPointsLabel}>{t("dashboard.totalPoints")}</span>
                    <span className={styles.statPointsValue}>
                      {formatInteger(user.totalPoints)}
                    </span>
                  </div>
                  <div className={styles.statsDivider} aria-hidden="true" />
                  <div className={styles.statRank}>
                    <span className={styles.statRankLabel}>{t("dashboard.rank")}</span>
                    <span className={styles.statRankValue}>{formatInteger(user.rank)}</span>
                  </div>
                  <div className={styles.statRound}>
                    <span className={styles.statRoundLabel}>{t("dashboard.round")}</span>
                    <span className={styles.statRoundValue}>{user.roundLabel}</span>
                  </div>
                  <div className={styles.statPercentile}>
                    <span className={styles.statPercentileLabel}>{t("dashboard.percentile")}</span>
                    <span className={styles.statPercentileValue}>
                      {t("dashboard.topPercent", { pct: user.topPercent })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
