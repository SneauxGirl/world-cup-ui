"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveScoreDemo } from "@/hooks/useLiveScoreDemo";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import {
  feedItems,
  liveMatches as seedMatches,
  rosterHealth,
  strategyInsight,
  topPerformers,
  userDashboard,
} from "@/data/dashboard-seed";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { LiveMatchesSection } from "@/components/dashboard/LiveMatchesSection";
import { TopPerformersSection } from "@/components/dashboard/TopPerformersSection";
import { RosterHealthSection } from "@/components/dashboard/RosterHealthSection";
import {
  LiveFeedBlock,
  StrategyInsightBlock,
} from "@/components/dashboard/StrategyFeedSections";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { SiteUtilities } from "@/components/dashboard/SiteUtilities";
import { LogoutConfirmModal } from "@/components/dashboard/LogoutConfirmModal";
import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { matches, announcerText } = useLiveScoreDemo(seedMatches);

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
        <div className={styles.shellTop}>
          <SiteHeader className={styles.shellHeader} />
          <div className={styles.shellUtilities}>
            <SiteUtilities onAccountClick={requestLogout} />
          </div>
        </div>
        <HeroSection
          user={userDashboard}
          feedItems={feedItems}
          onMenuAccountClick={requestLogout}
          className={styles.shellHero}
        />
        <main id="dashboard-main" className={styles.mainLayout}>
          <TopPerformersSection
            performers={topPerformers}
            className={styles.areaPerformers}
          />
          <LiveMatchesSection
            matches={matches}
            liveSummary={announcerText}
            className={styles.areaMatches}
          />
          <div className={styles.pairRow}>
            <RosterHealthSection data={rosterHealth} className={styles.areaRoster} />
            <StrategyInsightBlock
              text={strategyInsight}
              className={styles.areaStrategy}
            />
          </div>
          <LiveFeedBlock items={feedItems} className={styles.areaFeed} />
        </main>
      </div>
    </div>
  );
}
