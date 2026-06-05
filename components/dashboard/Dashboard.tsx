"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { useLogout } from "@/lib/auth/useLogout";
import { userDashboard } from "@/data/dashboard-seed";
import { buildRosterRecentActivity } from "@/lib/dashboard/recentActivity";
import { HeroSection } from "@/components/shared/HeroSection";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { useSiteUtilities } from "@/components/dashboard/SiteUtilities";
import { DashboardSiteFooter } from "@/components/dashboard/DashboardSiteFooter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardNextMatch } from "@/components/dashboard/DashboardNextMatch";
import { DashboardRosterPrompt } from "@/components/dashboard/DashboardRosterPrompt";
import { useDashboardInsightsStacked, useIsMobile } from "@/hooks/useMediaQuery";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import { PlayerStatsSection } from "@/components/dashboard/player-stats/PlayerStatsSection";
import { OverUnderSection } from "@/components/dashboard/value-trends/OverUnderSection";
import { getTotalFantasyPoints } from "@/lib/player-fantasy/profiles";
import {
  buildTopPerformers,
  isGlobalTopPerformersMode,
} from "@/lib/player-fantasy/topPerformers";
import { useRoster } from "@/lib/roster/RosterProvider";
import styles from "./Dashboard.module.scss";

/** Set true to restore the Next Match callout under RecentActivity. */
const SHOW_NEXT_MATCH = false;

export function Dashboard() {
  const logout = useLogout();
  const isMobile = useIsMobile();
  const isInsightsStacked = useDashboardInsightsStacked();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { rosterBySlot, rosterCount, loading: rosterLoading, isDemoMode } = useRoster();
  const performers = useMemo(
    () => buildTopPerformers(Object.values(rosterBySlot)),
    [rosterBySlot],
  );
  const globalTopPerformers = isGlobalTopPerformersMode(rosterCount);

  const recentActivityItems = useMemo(
    () => buildRosterRecentActivity(rosterBySlot),
    [rosterBySlot],
  );

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

  const showRosterPrompt = isDemoMode && !rosterLoading;

  const rosterAverageColumn = (
    <div className={styles.mainInsightsColumn}>
      <OverUnderSection className={styles.mainOverUnderSection} />
    </div>
  );

  const recentActivityBlock = (
    <div
      className={[
        styles.mainInsightsBlock,
        showRosterPrompt && styles.mainInsightsDemo,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.mainInsightsFocusShell}>
        <div className={styles.mainInsightsFrame}>
          <div className={styles.mainInsightsInner}>
            <RecentActivity
              items={recentActivityItems}
              className={styles.mainInsightsMessage}
            />
          </div>
        </div>
      </div>
      {SHOW_NEXT_MATCH ? (
        <DashboardNextMatch
          className={styles.mainNextMatch}
          dimmed={showRosterPrompt}
        />
      ) : null}
    </div>
  );

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
              {showRosterPrompt ? <DashboardRosterPrompt className={styles.mainRosterPrompt} /> : null}
              <section className={styles.mainTopRow}>
                {isInsightsStacked ? (
                  <>
                    {recentActivityBlock}
                    {rosterAverageColumn}
                  </>
                ) : (
                  <>
                    {rosterAverageColumn}
                    {recentActivityBlock}
                  </>
                )}
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
