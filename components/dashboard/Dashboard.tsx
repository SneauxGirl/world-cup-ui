"use client";

import { useLiveScoreDemo } from "@/hooks/useLiveScoreDemo";
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
import { BottomNav, SidebarNav } from "@/components/dashboard/Navigation";
import styles from "./Dashboard.module.scss";

export function Dashboard() {
  const { matches, announcerText } = useLiveScoreDemo(seedMatches);

  return (
    <div className={styles.page}>
      <SidebarNav />
      <div className={styles.shell}>
        <main id="dashboard-main" className={styles.mainLayout}>
          <HeroSection user={userDashboard} className={styles.areaHero} />
          <LiveMatchesSection
            matches={matches}
            liveSummary={announcerText}
            className={styles.areaMatches}
          />
          <TopPerformersSection
            performers={topPerformers}
            className={styles.areaPerformers}
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
      <BottomNav />
    </div>
  );
}
