"use client";

import { useCallback, useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { userDashboard } from "@/data/dashboard-seed";
import { useLogout } from "@/lib/auth/useLogout";
import { SquadSelectionPanel } from "@/components/dashboard/SquadSelectionPanel";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { SiteUtilities } from "@/components/dashboard/SiteUtilities";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import shellStyles from "./Dashboard.module.scss";
import styles from "./RosterPage.module.scss";

export function RosterPage() {
  const logout = useLogout();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const requestLogout = useCallback(() => setLogoutOpen(true), []);
  const cancelLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    void logout();
  }, [logout]);
  return (
    <RequireAuth>
    <div className={shellStyles.page}>
      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
      <SidebarNav />
      <div className={shellStyles.shell}>
        <TodayMatchesStrip className={shellStyles.shellMatches} />
        <div className={`${shellStyles.shellTopBand} ${shellStyles.contentBandTop}`}>
          <div className={shellStyles.pageGutter}>
            <div className={shellStyles.pageColumn}>
              <div className={shellStyles.shellTop}>
                <SiteHeader
                  brand="dashboard"
                  className={shellStyles.shellHeader}
                  onAccountClick={requestLogout}
                />
                <div className={shellStyles.shellUtilities}>
                  <SiteUtilities onLogout={requestLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${shellStyles.pageGutter} ${shellStyles.contentBandMain}`}>
          <div className={shellStyles.pageColumn}>
            <main id="roster-main" className={styles.main}>
              <SquadSelectionPanel
                variant="embedded"
                managerName={userDashboard.displayName}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}
