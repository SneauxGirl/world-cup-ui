import Image from "next/image";
import Link from "next/link";
import { HeroLiveFeed } from "@/components/dashboard/HeroLiveFeed";
import { HeroNavMenu } from "@/components/dashboard/HeroNavMenu";
import { t } from "@/lib/i18n/t";
import { HeroTopPerformers } from "@/components/dashboard/HeroTopPerformers";
import type { DashboardPerformer, FeedItem, UserDashboard } from "@/data/types";
import styles from "./HeroSection.module.scss";

type Props = {
  user: UserDashboard;
  feedItems?: FeedItem[];
  /** When false, omits the hero live-feed stats card (login layout). */
  showLiveFeed?: boolean;
  /** Login page: stadium art only (no welcome, feed, or CTA). */
  loginHero?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  /** When set, CTA opens squad flow instead of navigating. */
  onCtaClick?: () => void;
  onMenuAccountClick?: () => void;
  performers?: DashboardPerformer[];
  className?: string;
};

export function HeroSection({
  user,
  feedItems = [],
  showLiveFeed = true,
  loginHero = false,
  ctaHref = "/dashboard",
  ctaLabel = t("dashboard.setYourRoster"),
  onCtaClick,
  onMenuAccountClick,
  performers = [],
  className,
}: Props) {
  const showFeed = showLiveFeed && feedItems.length > 0;
  const hasPerformers = performers.length > 0;

  const heroCta = (
    <div className={styles.heroActionRow}>
      <div className={styles.heroCtaWrap}>
        <div className={styles.heroCtaTrim}>
          {onCtaClick ? (
            <button type="button" className={styles.heroCta} onClick={onCtaClick}>
              {ctaLabel}
            </button>
          ) : (
            <Link className={styles.heroCta} href={ctaHref}>
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section
      className={[
        styles.hero,
        !showFeed && styles.heroNoFeed,
        loginHero ? styles.heroLogin : styles.heroDashboard,
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
                  <h1 id="dashboard-hero-heading" className={styles.title}>
                    <span className={styles.titleGreeting}>
                      {t("dashboard.welcomeBackGreeting")}
                    </span>
                    <span className={styles.titleName}>{user.displayName}</span>
                  </h1>
                  {showFeed ? (
                    <div className={styles.statsCardFrame}>
                      <div className={styles.statsCardInner}>
                        <HeroLiveFeed items={feedItems} />
                      </div>
                    </div>
                  ) : null}
                </div>
                {heroCta}
              </div>
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
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
