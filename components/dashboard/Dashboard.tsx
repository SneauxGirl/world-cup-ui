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
import { useIsMobile } from "@/hooks/useMediaQuery";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import { PlayerStatsSection } from "@/components/dashboard/player-stats/PlayerStatsSection";
import { ValueTrendsSection } from "@/components/dashboard/value-trends/ValueTrendsSection";
import { squadPlayerPool, type SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import { getTotalFantasyPoints } from "@/lib/player-fantasy/profiles";
import { getTemplateForPlayer } from "@/lib/player-fantasy/buildTemplate";
import {
  getStripLastGameVsAverageDelta,
  getStripVolatilityRange,
} from "@/lib/value-trends/compute";
import { useRoster } from "@/lib/roster/RosterProvider";
import styles from "./Dashboard.module.scss";

type TrendKind = "riser" | "faller" | "volatile";

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? null;
}

export function Dashboard() {
  const logout = useLogout();
  const isMobile = useIsMobile();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { rosterBySlot, rosterCount } = useRoster();
  const squadById = useMemo(
    () => new Map(squadPlayerPool.map((player) => [player.id, player])),
    [],
  );

  const performers = useMemo(() => {
    // Rule: roster size 0-2 uses global; 3+ uses roster only.
    const sourcePlayers: SquadPlayerPoolEntry[] =
      rosterCount <= 2 ? squadPlayerPool : Object.values(rosterBySlot);

    const scored = sourcePlayers
      .map((player) => {
        const template = getTemplateForPlayer(player.id, player.position);
        if (!template) return null;
        return {
          player,
          delta: getStripLastGameVsAverageDelta(template),
          range: getStripVolatilityRange(template),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    const selectedIds = new Set<string>();
    const kinds: TrendKind[] = ["riser", "faller", "volatile"];

    return kinds
      .map((kind) => {
        const available = scored.filter((entry) => !selectedIds.has(entry.player.id));
        const pool = available.length > 0 ? available : scored;
        if (pool.length === 0) return null;

        let bestValue: number;
        let tied: typeof pool;
        if (kind === "riser") {
          bestValue = Math.max(...pool.map((entry) => entry.delta));
          tied = pool.filter((entry) => entry.delta === bestValue);
        } else if (kind === "faller") {
          bestValue = Math.min(...pool.map((entry) => entry.delta));
          tied = pool.filter((entry) => entry.delta === bestValue);
        } else {
          bestValue = Math.max(...pool.map((entry) => entry.range));
          tied = pool.filter((entry) => entry.range === bestValue);
        }

        const chosen = pickRandom(tied);
        if (!chosen) return null;
        selectedIds.add(chosen.player.id);
        const player = squadById.get(chosen.player.id);
        if (!player) return null;

        return {
          id: player.id,
          name: `${player.firstName} ${player.lastName}`.trim(),
          teamCode: player.teamCode,
          position: player.position,
          points: getTotalFantasyPoints(player.id),
          trendKind: kind,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [rosterBySlot, rosterCount, squadById]);

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
              performers={performers}
              inContentColumn
              className={styles.shellHero}
            />
          </div>
        </div>
        <div className={`${styles.pageGutter} ${styles.contentBandMain}`}>
          <div className={styles.pageColumn}>
            <main id="dashboard-main" className={styles.mainLayout}>
              <ValueTrendsSection />
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
