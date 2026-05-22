import Image from "next/image";
import Link from "next/link";
import { HeroLiveFeed } from "@/components/dashboard/HeroLiveFeed";
import { HeroNavMenu } from "@/components/dashboard/HeroNavMenu";
import { t } from "@/lib/i18n/t";
import type { FeedItem, UserDashboard } from "@/data/types";
import styles from "./HeroSection.module.scss";

type Props = {
  user: UserDashboard;
  feedItems?: FeedItem[];
  /** When false, omits the hero live-feed stats card (login layout). */
  showLiveFeed?: boolean;
  /** Login page: stadium art + kicker only (no welcome, feed, or CTA). */
  loginHero?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  onMenuAccountClick?: () => void;
  className?: string;
};

export function HeroSection({
  user,
  feedItems = [],
  showLiveFeed = true,
  loginHero = false,
  ctaHref = "/dashboard",
  ctaLabel = t("dashboard.setYourRoster"),
  onMenuAccountClick,
  className,
}: Props) {
  const showFeed = showLiveFeed && feedItems.length > 0;

  return (
    <section
      className={[
        styles.hero,
        !showFeed && styles.heroNoFeed,
        loginHero && styles.heroLogin,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={loginHero ? undefined : "dashboard-hero-heading"}
      aria-label={loginHero ? t("login.heroRegion") : undefined}
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
            {!loginHero ? (
              <p className={styles.kicker}>{t("app.worldCupChallenge")}</p>
            ) : null}
            <div className={styles.heroMenu}>
              <HeroNavMenu onAccountClick={onMenuAccountClick} />
            </div>
          </div>
          {!loginHero ? (
            <div className={styles.heroPrimary}>
              <h1 id="dashboard-hero-heading" className={styles.title}>
                <span className={styles.titleGreeting}>{t("dashboard.welcomeBackGreeting")}</span>
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
          ) : null}
          {!loginHero ? (
            <div className={styles.heroActionRow}>
              <div className={styles.heroCtaWrap}>
                <Link className={styles.heroCta} href={ctaHref}>
                  {ctaLabel}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
