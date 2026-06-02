import Image from "next/image";
import { HeroCtaLiveFeed } from "@/components/dashboard/HeroCtaLiveFeed";
import { HeroManagerStats } from "@/components/dashboard/HeroManagerStats";
import { HeroNavMenu } from "@/components/dashboard/HeroNavMenu";
import { t } from "@/lib/i18n/t";
import { HeroTopPerformers } from "@/components/dashboard/hero-top-performers";
import type { DashboardPerformer, FeedItem, UserDashboard } from "@/data/types";
import styles from "./HeroSection.module.scss";

type Props = {
  user: UserDashboard;
  feedItems?: FeedItem[];
  /** When false, omits the hero live-feed panel (login layout). */
  showLiveFeed?: boolean;
  /** Login page: stadium art only (no welcome, feed, or CTA). */
  loginHero?: boolean;
  onMenuAccountClick?: () => void;
  performers?: DashboardPerformer[];
  /** When true, hero performers block uses global pool heading. */
  globalTopPerformers?: boolean;
  /** Dashboard/roster: parent supplies pageGutter + pageColumn (no inner max-width pad). */
  inContentColumn?: boolean;
  className?: string;
};

export function HeroSection({
  user,
  feedItems = [],
  showLiveFeed = true,
  loginHero = false,
  onMenuAccountClick,
  performers = [],
  globalTopPerformers = false,
  inContentColumn = false,
  className,
}: Props) {
  const showFeedPanel = showLiveFeed && feedItems.length > 0;
  const hasPerformers = performers.length > 0;

  return (
    <section
      className={[
        styles.hero,
        !showFeedPanel && styles.heroNoFeed,
        loginHero ? styles.heroLogin : styles.heroDashboard,
        inContentColumn && styles.heroInContentColumn,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={loginHero ? undefined : "dashboard-hero-heading"}
      aria-label={loginHero ? t("login.heroRegion") : undefined}
    >
      {loginHero ? (
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
      ) : null}
      <div className={styles.heroStack}>
        <div className={styles.heroContent}>
          {!loginHero ? (
            <>
              <div className={styles.heroCopy}>
                <div className={styles.heroTopRow}>
                  <div className={styles.heroMenu}>
                    <HeroNavMenu onAccountClick={onMenuAccountClick} />
                  </div>
                </div>
                <div className={styles.heroPrimary}>
                  <div className={styles.heroTitleColumn}>
                    <h1 id="dashboard-hero-heading" className={styles.title}>
                      <span className={styles.titleGreeting}>
                        {t("dashboard.welcomeBackGreeting")}
                      </span>
                      <span className={styles.titleName}>{user.displayName}</span>
                    </h1>
                    <HeroManagerStats
                      totalPoints={user.totalPoints}
                      rank={user.rank}
                      topPercent={user.topPercent}
                      className={styles.heroManagerStats}
                    />
                    {showFeedPanel ? (
                      <div
                        className={styles.statsCardFrame}
                        aria-labelledby="hero-live-feed-heading"
                      >
                        <div className={styles.statsCardInner}>
                          <h2 id="hero-live-feed-heading" className={styles.liveFeedTitle}>
                            {t("dashboard.liveFeed")}
                          </h2>
                          <HeroCtaLiveFeed items={feedItems} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {hasPerformers ? (
                <HeroTopPerformers
                  performers={performers}
                  globalTopPerformers={globalTopPerformers}
                  className={styles.heroAsidePerformers}
                />
              ) : (
                <figure className={styles.heroAsideConstruction} aria-hidden="true">
                  <Image
                    src="/underconstructiontrsp.png"
                    alt=""
                    width={1152}
                    height={768}
                    priority
                    className={styles.heroAsideConstructionImage}
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 42vw, 520px"
                  />
                </figure>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
