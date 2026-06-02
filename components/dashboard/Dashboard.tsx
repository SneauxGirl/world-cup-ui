"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { feedItems, strategyInsight, userDashboard } from "@/data/dashboard-seed";
import { HeroSection } from "@/components/shared/HeroSection";
import { LiveMatchesSection } from "@/components/dashboard/LiveMatchesSection";
import { FormHighlightsSection } from "@/components/dashboard/FormHighlightsSection";
import { StrategyInsightBlock } from "@/components/dashboard/StrategyFeedSections";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { SiteUtilities } from "@/components/dashboard/SiteUtilities";
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
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { rosterBySlot, rosterCount } = useRoster();

  const performers = useMemo(
    () => buildTopPerformers(Object.values(rosterBySlot)),
    [rosterBySlot],
  );
  const globalTopPerformers = isGlobalTopPerformersMode(rosterCount);

  const requestLogout = useCallback(() => setLogoutOpen(true), []);
  const cancelLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    router.push("/");
  }, [router]);
  const confirmSidebarLogout = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (!logoutOpen) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [logoutOpen]);

  return (
    <div className={styles.page}>
      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
      <SidebarNav onLogoutConfirm={confirmSidebarLogout} />
      <div className={styles.shell}>
        <TodayMatchesStrip className={styles.shellMatches} />
        <div className={`${styles.shellTopBand} ${styles.contentBandTop}`}>
          <div className={styles.pageGutter}>
            <div className={styles.pageColumn}>
              <div className={styles.shellTop}>
                <SiteHeader
                  brand="dashboard"
                  className={styles.shellHeader}
                  onAccountClick={requestLogout}
                />
                <div className={styles.shellUtilities}>
                  <SiteUtilities onAccountClick={requestLogout} />
                </div>
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
              onMenuAccountClick={requestLogout}
              inContentColumn
              className={styles.shellHero}
            />
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandMain}`}>
          <div className={styles.pageColumn}>
            <main id="dashboard-main" className={styles.mainLayout}>
              <LiveMatchesSection items={feedItems} className={styles.areaMatches} />
              <div className={styles.pairRow}>
                <FormHighlightsSection className={styles.areaRoster} />
                <StrategyInsightBlock
                  text={strategyInsight}
                  className={styles.areaStrategy}
                />
              </div>
              <ValueTrendsSection className={styles.areaValueTrends} />
              <PlayerStatsSection className={styles.areaPlayerStats} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
