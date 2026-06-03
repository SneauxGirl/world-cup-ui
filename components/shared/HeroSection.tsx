import Image from "next/image";
import Link from "next/link";
import formStyles from "@/components/auth/LoginForm.module.scss";
import loginPromptStyles from "@/components/auth/LoginHeroPrompt.module.scss";
import { HeroManagerStats } from "@/components/dashboard/HeroManagerStats";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import { HeroTopPerformers } from "@/components/dashboard/hero-top-performers";
import type { DashboardPerformer, UserDashboard } from "@/data/types";
import styles from "./HeroSection.module.scss";

type Props = {
  user: UserDashboard;
  /** Login page: stadium art only (no welcome, stats, or CTA). */
  loginHero?: boolean;
  performers?: DashboardPerformer[];
  /** When true, hero performer heading uses global pool copy. */
  globalTopPerformers?: boolean;
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
  loginHero = false,
  performers = [],
  globalTopPerformers = false,
  inContentColumn = false,
  showEditRosterCta = true,
  showEditRosterUnderPhotosLink = false,
  className,
}: Props) {
  const hasPerformers = performers.length > 0;
  const showEditRoster = showEditRosterCta || showEditRosterUnderPhotosLink;

  return (
    <section
      className={[
        styles.hero,
        loginHero ? styles.heroLogin : styles.heroDashboard,
        inContentColumn && styles.heroInContentColumn,
        showEditRoster && styles.heroHasEditRoster,
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
              src="/LoginHero-t.png"
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
              <div className={styles.heroDashboardMain}>
                <div className={styles.heroCopy}>
                  <div className={styles.heroPrimary}>
                    <div className={styles.heroCopyWelcome}>
                      <h1 id="dashboard-hero-heading" className={styles.title}>
                        <span className={styles.titleGreeting}>
                          {t("dashboard.welcomeBackGreeting")}
                        </span>
                        <span className={styles.titleName}>{user.displayName}</span>
                      </h1>
                    </div>
                    <div className={styles.heroCopyStats}>
                      <HeroManagerStats
                        totalPoints={user.totalPoints}
                        rank={user.rank}
                        topPercent={user.topPercent}
                        className={styles.heroManagerStats}
                      />
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
                  {showEditRosterUnderPhotosLink ? (
                    <div className={styles.heroUnderPhotosLinkRow}>
                      <Link className={styles.heroUnderPhotosLink} href="/roster">
                        {t("dashboard.editRoster")}
                        <IconChevronRight className={styles.heroUnderPhotosLinkIcon} aria-hidden="true" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
              {showEditRoster ? (
                <div className={styles.heroEditRosterMobileRow}>
                  <div
                    className={[
                      formStyles.chamferTrim,
                      loginPromptStyles.signInTrim,
                      styles.heroEditRosterMobileTrim,
                    ].join(" ")}
                  >
                    <Link
                      href="/roster"
                      className={[
                        formStyles.chamferBtn,
                        formStyles.signInBtn,
                        loginPromptStyles.heroSignInBtn,
                        styles.heroEditRosterMobileLink,
                      ].join(" ")}
                    >
                      {t("dashboard.editRoster")}
                    </Link>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
