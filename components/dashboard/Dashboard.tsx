"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import {
  feedItems,
  rosterHealth,
  strategyInsight,
  topPerformers,
  userDashboard,
} from "@/data/dashboard-seed";
import { HeroSection } from "@/components/shared/HeroSection";
import { LiveMatchesSection } from "@/components/dashboard/LiveMatchesSection";
import { RosterHealthSection } from "@/components/dashboard/RosterHealthSection";
import { StrategyInsightBlock } from "@/components/dashboard/StrategyFeedSections";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { SiteUtilities } from "@/components/dashboard/SiteUtilities";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import { ValueTrendsSection } from "@/components/dashboard/value-trends/ValueTrendsSection";
import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const requestLogout = useCallback(() => setLogoutOpen(true), []);
  const cancelLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    router.push("/");
  }, [router]);
  const confirmSidebarLogout = useCallback(() => {
    router.push("/");
  }, [router]);

  const goToRoster = useCallback(() => router.push("/roster"), [router]);

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
        <HeroSection
          user={userDashboard}
          showLiveFeed={false}
          performers={topPerformers}
          onCtaClick={goToRoster}
          onMenuAccountClick={requestLogout}
          className={styles.shellHero}
        />
        <main id="dashboard-main" className={styles.mainLayout}>
          <LiveMatchesSection items={feedItems} className={styles.areaMatches} />
          <div className={styles.pairRow}>
            <RosterHealthSection data={rosterHealth} className={styles.areaRoster} />
            <StrategyInsightBlock
              text={strategyInsight}
              className={styles.areaStrategy}
            />
          </div>
          <ValueTrendsSection className={styles.areaValueTrends} />
        </main>
      </div>
    </div>
  );
}
