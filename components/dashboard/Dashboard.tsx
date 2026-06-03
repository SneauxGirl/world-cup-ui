"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { useLogout } from "@/lib/auth/useLogout";
import { feedItems, userDashboard } from "@/data/dashboard-seed";
import { HeroSection } from "@/components/shared/HeroSection";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { useSiteUtilities } from "@/components/dashboard/SiteUtilities";
import { DashboardSiteFooter } from "@/components/dashboard/DashboardSiteFooter";
import { HeroCtaLiveFeed } from "@/components/dashboard/HeroCtaLiveFeed";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import { PlayerStatsSection } from "@/components/dashboard/player-stats/PlayerStatsSection";
import { OverUnderSection } from "@/components/dashboard/value-trends/OverUnderSection";
import { getTotalFantasyPoints } from "@/lib/player-fantasy/profiles";
import {
  buildTopPerformers,
  isGlobalTopPerformersMode,
} from "@/lib/player-fantasy/topPerformers";
import { t } from "@/lib/i18n/t";
import { useRoster } from "@/lib/roster/RosterProvider";
import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const logout = useLogout();
  const isMobile = useIsMobile();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { rosterBySlot, rosterCount, loading: rosterLoading } = useRoster();
  const performers = useMemo(
    () => buildTopPerformers(Object.values(rosterBySlot)),
    [rosterBySlot],
  );
  const globalTopPerformers = isGlobalTopPerformersMode(rosterCount);

  const dashboardUser = useMemo(() => {
    if (rosterLoading) return userDashboard;
    const totalPoints = Object.values(rosterBySlot).reduce(
      (sum, player) => sum + getTotalFantasyPoints(player.id),
      0,
    );
    return {
      ...userDashboard,
      totalPoints,
    };
  }, [rosterBySlot, rosterLoading]);

  const rosterInsight = useMemo(() => {
    const rosterPlayers = Object.values(rosterBySlot);
    if (rosterPlayers.length === 0) {
      return "AI Insight: lock your roster to generate personalized player calls.";
    }

    const focusPlayer = rosterPlayers.reduce((best, current) => {
      return getTotalFantasyPoints(current.id) > getTotalFantasyPoints(best.id) ? current : best;
    });

    const points = getTotalFantasyPoints(focusPlayer.id);
    return `AI Insight: ${focusPlayer.firstName} ${focusPlayer.lastName} is your form anchor at ${points} total fantasy points — keep them locked for the next slate.`;
  }, [rosterBySlot]);

  const requestLogout = useCallback(() => setLogoutOpen(true), []);
  const { headerUtilities, overlays, DrawerSearch } = useSiteUtilities({
    onLogout: requestLogout,
    showSearchInHeader: !isMobile,
  });
  const cancelLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    void logout();
  }, [logout]);
  useEffect(() => {
    if (!logoutOpen) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [logoutOpen]);

  return (
    <RequireAuth>
    <div className={`${styles.page} ${styles.pageWithHero}`}>
      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
      <SidebarNav />
      <div className={styles.shell}>
        <TodayMatchesStrip className={styles.shellMatches} />
        <div className={`${styles.shellTopBand} ${styles.contentBandTop}`}>
          <div className={styles.pageGutter}>
            <div className={styles.pageColumn}>
              <div className={styles.shellTop}>
                <SiteHeader
                  brand="dashboard"
                  className={styles.shellHeader}
                  utilities={
                    <>
                      {headerUtilities}
                      {overlays}
                    </>
                  }
                  drawerSearch={DrawerSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandHero}`}>
          <div className={styles.pageColumn}>
            <HeroSection
              user={dashboardUser}
              feedItems={feedItems}
              showLiveFeed={false}
              performers={performers}
              globalTopPerformers={globalTopPerformers}
              inContentColumn
              showEditRosterCta={false}
              showEditRosterUnderPhotosLink
              className={styles.shellHero}
            />
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandMain}`}>
          <div className={styles.pageColumn}>
            <main id="dashboard-main" className={styles.mainLayout}>
              <section className={styles.mainTopRow} aria-label={t("dashboard.liveFeed")}>
                <div className={styles.mainLiveFeedBlock}>
                  <div
                    className={styles.mainLiveFeedFrame}
                    aria-label={t("dashboard.liveFeed")}
                  >
                    <div className={styles.mainLiveFeedInner}>
                      <HeroCtaLiveFeed
                        insight={rosterInsight}
                        className={styles.mainLiveFeedTicker}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.mainInsightsColumn}>
                  <OverUnderSection className={styles.mainOverUnderSection} />
                </div>
              </section>
              <PlayerStatsSection />
            </main>
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandFooter}`}>
          <div className={styles.pageColumn}>
            <DashboardSiteFooter />
          </div>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}
