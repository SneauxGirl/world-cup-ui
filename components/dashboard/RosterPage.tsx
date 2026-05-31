"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { userDashboard } from "@/data/dashboard-seed";
import { SquadSelectionPanel } from "@/components/dashboard/SquadSelectionPanel";
import { SidebarNav } from "@/components/dashboard/Navigation";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { SiteUtilities } from "@/components/dashboard/SiteUtilities";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import shellStyles from "./Dashboard.module.scss";
import styles from "./RosterPage.module.scss";

export function RosterPage() {
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

  return (
    <div className={shellStyles.page}>
      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
      <SidebarNav onLogoutConfirm={confirmSidebarLogout} />
      <div className={shellStyles.shell}>
        <TodayMatchesStrip className={shellStyles.shellMatches} />
        <div className={shellStyles.shellTop}>
          <SiteHeader
            brand="dashboard"
            className={shellStyles.shellHeader}
            onAccountClick={requestLogout}
          />
          <div className={shellStyles.shellUtilities}>
            <SiteUtilities onAccountClick={requestLogout} />
          </div>
        </div>
        <main id="roster-main" className={styles.main}>
          <SquadSelectionPanel
            variant="embedded"
            managerName={userDashboard.displayName}
          />
        </main>
      </div>
    </div>
  );
}
