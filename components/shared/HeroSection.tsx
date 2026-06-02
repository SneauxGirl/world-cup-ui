import Image from "next/image";
import Link from "next/link";
import { HeroCtaLiveFeed } from "@/components/dashboard/HeroCtaLiveFeed";
import { HeroManagerStats } from "@/components/dashboard/HeroManagerStats";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
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
  performers?: DashboardPerformer[];
  /** Dashboard/roster: parent supplies pageGutter + pageColumn (no inner max-width pad). */
  inContentColumn?: boolean;
  /** When false, hides the Edit Roster CTA in hero copy column. */
  showEditRosterCta?: boolean;
  /** When true, shows text+chevron roster link under performer photos. */
  showEditRosterUnderPhotosLink?: boolean;
  className?: string;
};

export function HeroSection({
  user,
  feedItems = [],
  showLiveFeed = true,
  loginHero = false,
  performers = [],
  inContentColumn = false,
  showEditRosterCta = true,
  showEditRosterUnderPhotosLink = false,
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
                      <>
                        <h2 id="hero-live-feed-heading" className={styles.liveFeedLabel}>
                          {t("dashboard.liveFeed")}
                        </h2>
                        <div
                          className={styles.statsCardFrame}
                          aria-labelledby="hero-live-feed-heading"
                        >
                          <div className={styles.statsCardInner}>
                            <HeroCtaLiveFeed items={feedItems} />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                {showEditRosterCta ? (
                  <div className={styles.heroEditRosterFrame}>
                    <Link className={styles.heroEditRosterLink} href="/roster">
                      {t("dashboard.editRoster")}
                      <IconChevronRight className={styles.heroEditRosterIcon} aria-hidden="true" />
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className={styles.heroAsideStack}>
                {hasPerformers ? (
                  <HeroTopPerformers
                    performers={performers}
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
                {showEditRosterUnderPhotosLink ? (
                  <div className={styles.heroUnderPhotosLinkRow}>
                    <Link className={styles.heroUnderPhotosLink} href="/roster">
                      {t("dashboard.editRoster")}
                      <IconChevronRight className={styles.heroUnderPhotosLinkIcon} aria-hidden="true" />
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
