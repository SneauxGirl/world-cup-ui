"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { useLogout } from "@/lib/auth/useLogout";
import { feedItems, strategyInsight, userDashboard } from "@/data/dashboard-seed";
import { HeroSection } from "@/components/shared/HeroSection";
import { FormHighlightsSection } from "@/components/dashboard/FormHighlightsSection";
import { StrategyInsightBlock } from "@/components/dashboard/StrategyFeedSections";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { useSiteUtilities } from "@/components/dashboard/SiteUtilities";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import { PlayerStatsSection } from "@/components/dashboard/player-stats/PlayerStatsSection";
import { ValueTrendsSection } from "@/components/dashboard/value-trends/ValueTrendsSection";
import {
  buildTopPerformers,
  isGlobalTopPerformersMode,
} from "@/lib/player-fantasy/topPerformers";
import { useRoster } from "@/lib/roster/RosterProvider";
import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const logout = useLogout();
  const isMobile = useIsMobile();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { rosterBySlot, rosterCount } = useRoster();

  const performers = useMemo(
    () => buildTopPerformers(Object.values(rosterBySlot)),
    [rosterBySlot],
  );
  const globalTopPerformers = isGlobalTopPerformersMode(rosterCount);

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
              user={userDashboard}
              feedItems={feedItems}
              showLiveFeed
              performers={performers}
              globalTopPerformers={globalTopPerformers}
              inContentColumn
              className={styles.shellHero}
            />
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandMain}`}>
          <div className={styles.pageColumn}>
            <main id="dashboard-main" className={styles.mainLayout}>
              <div className={styles.pairRow}>
                <FormHighlightsSection />
                <StrategyInsightBlock text={strategyInsight} />
              </div>
              <ValueTrendsSection />
              <PlayerStatsSection />
            </main>
          </div>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}
