"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutConfirmModal } from "@/components/shared/LogoutConfirmModal";
import {
  IconCalendar,
  IconDashboard,
  IconGear,
  IconPeople,
  IconShirt,
  IconTournament,
} from "@/components/icons/DashboardIcons";
import { SidebarNavLink } from "@/components/dashboard/SidebarNavLink";
import { GitHubOctocatIcon } from "@/components/icons/GitHubOctocatIcon";
import { userDashboard } from "@/data/dashboard-seed";
import { getDashboardAppNavActiveKey } from "@/lib/dashboard-app-nav";
import { t } from "@/lib/i18n/t";
import { formatFirstNameLastInitial } from "@/lib/i18n/format";
import styles from "./Navigation.module.scss";

const sidebarNavItems = [
  { key: "dashboard" as const, href: "/dashboard", icon: IconDashboard, label: "Dashboard" },
  { key: "roster" as const, href: "/roster", icon: IconShirt, label: "My Roster" },
  { key: "matches" as const, href: "#", icon: IconCalendar, label: "Matches" },
  {
    key: "standings" as const,
    href: "#",
    label: "Standings",
    animateIcon: "trophy" as const,
  },
  { key: "players" as const, href: "#", icon: IconPeople, label: "Players" },
  { key: "tournament" as const, href: "#", icon: IconTournament, label: "Tournament" },
  {
    key: "store" as const,
    href: "#",
    label: "Store",
    animateIcon: "cart" as const,
  },
  { key: "settings" as const, href: "#", icon: IconGear, label: "Settings" },
];

type SidebarNavProps = {
  onLogoutConfirm?: () => void;
};

export function SidebarNav({ onLogoutConfirm }: SidebarNavProps) {
  const pathname = usePathname();
  const activeKey = getDashboardAppNavActiveKey(pathname);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const profileCardRef = useRef<HTMLButtonElement>(null);

  const openLogout = useCallback(() => setLogoutOpen(true), []);
  const closeLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    onLogoutConfirm?.();
  }, [onLogoutConfirm]);

  return (
    <div className={styles.sidebarShell}>
      <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <Link href="/dashboard" className={styles.brandLogoLink}>
          <Image
            src="/wcc-logo-white.png"
            alt="WCC"
            width={512}
            height={256}
            className={styles.brandLogo}
            priority
          />
        </Link>
      </div>
      <nav className={styles.sideNav} aria-label="Primary">
        <ul className={styles.sideList}>
          {sidebarNavItems.map((item) => (
            <li key={item.key}>
              <SidebarNavLink
                href={item.href}
                label={item.label}
                icon={"icon" in item ? item.icon : undefined}
                active={item.key === activeKey}
                animateIcon={"animateIcon" in item ? item.animateIcon : undefined}
              />
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.profile}>
        {onLogoutConfirm ? (
          <>
            <button
              ref={profileCardRef}
              type="button"
              className={styles.profileCardTrigger}
              onClick={openLogout}
              aria-haspopup="dialog"
              aria-expanded={logoutOpen}
              aria-label={t("auth.accountMenu")}
            >
              <div className={styles.profileCard}>
                <div className={styles.profileCardInner}>
                  <span className={styles.avatarFrame} aria-hidden="true">
                    <span className={styles.avatarOctocat}>
                      <GitHubOctocatIcon width={48} height={48} />
                    </span>
                  </span>
                  <div className={styles.profileText}>
                    <p className={styles.profileName}>
                      {formatFirstNameLastInitial(userDashboard.displayName)}
                    </p>
                    <p className={styles.profileTitle}>{t("dashboard.eliteManager")}</p>
                  </div>
                </div>
              </div>
            </button>
            <LogoutConfirmModal
              open={logoutOpen}
              placement="anchored"
              anchorRef={profileCardRef}
              onCancel={closeLogout}
              onConfirm={confirmLogout}
            />
          </>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileCardInner}>
              <a
                href="https://github.com/sneauxgirl"
                className={styles.avatarFrame}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Heather Hugo — portfolio on GitHub (opens in new tab)"
              >
                <span className={styles.avatarOctocat}>
                  <GitHubOctocatIcon width={48} height={48} />
                </span>
              </a>
              <div className={styles.profileText}>
                <p className={styles.profileName}>
                  {formatFirstNameLastInitial(userDashboard.displayName)}
                </p>
                <p className={styles.profileTitle}>{t("dashboard.eliteManager")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </aside>
    </div>
  );
}
