"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoutConfirmModal } from "@/components/dashboard/LogoutConfirmModal";
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
import { t } from "@/lib/i18n/t";
import { formatFirstNameLastInitial, formatInteger } from "@/lib/i18n/format";
import styles from "./Navigation.module.scss";

const sidebarNavItems = [
  { key: "dashboard" as const, href: "/dashboard", icon: IconDashboard, label: "Dashboard" },
  { key: "roster" as const, href: "/dashboard", icon: IconShirt, label: "My Roster" },
  { key: "matches" as const, href: "/dashboard", icon: IconCalendar, label: "Matches" },
  {
    key: "standings" as const,
    href: "/dashboard",
    label: "Standings",
    animateIcon: "trophy" as const,
  },
  { key: "players" as const, href: "/dashboard", icon: IconPeople, label: "Players" },
  { key: "tournament" as const, href: "/dashboard", icon: IconTournament, label: "Tournament" },
  {
    key: "store" as const,
    href: "/dashboard",
    label: "Store",
    animateIcon: "cart" as const,
  },
  { key: "settings" as const, href: "/dashboard", icon: IconGear, label: "Settings" },
];

type SidebarNavProps = {
  onLogoutConfirm?: () => void;
};

export function SidebarNav({ onLogoutConfirm }: SidebarNavProps) {
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
            src="/wcc-logo2.png"
            alt="WCC"
            width={512}
            height={512}
            className={styles.brandLogo}
            priority
          />
        </Link>
      </div>
      <nav className={styles.sideNav} aria-label="Primary">
        <ul className={styles.sideList}>
          {sidebarNavItems.map((item) => {
            const isDashboard = item.key === "dashboard";
            return (
              <li key={item.key}>
                <SidebarNavLink
                  href={item.href}
                  label={item.label}
                  icon={"icon" in item ? item.icon : undefined}
                  active={isDashboard}
                  animateIcon={"animateIcon" in item ? item.animateIcon : undefined}
                />
              </li>
            );
          })}
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
        <section className={styles.rankCard} aria-label={t("dashboard.globalRank")}>
          <div className={styles.rankCardInner}>
            <p className={styles.rankEyebrow}>{t("dashboard.globalRank")}</p>
            <p className={styles.rankValue}>{formatInteger(userDashboard.rank)}</p>
            <p className={styles.rankPercent}>
              {t("dashboard.topPercent", { pct: userDashboard.topPercent })}
            </p>
          </div>
        </section>
      </div>
      </aside>
    </div>
  );
}
