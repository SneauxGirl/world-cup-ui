import Image from "next/image";
import Link from "next/link";
import {
  IconCalendar,
  IconDashboard,
  IconDots,
  IconGear,
  IconPeople,
  IconShirt,
  IconTournament,
} from "@/components/icons/DashboardIcons";
import { SidebarNavLink } from "@/components/dashboard/SidebarNavLink";
import { GitHubOctocatIcon } from "@/components/icons/GitHubOctocatIcon";
import { userDashboard } from "@/data/dashboard-seed";
import { t } from "@/lib/i18n/t";
import { formatFirstNameLastInitial } from "@/lib/i18n/format";
import styles from "./Navigation.module.scss";

const sidebarNavItems = [
  { key: "dashboard" as const, href: "/", icon: IconDashboard, label: "Dashboard" },
  { key: "roster" as const, href: "/", icon: IconShirt, label: "My Roster" },
  { key: "matches" as const, href: "/", icon: IconCalendar, label: "Matches" },
  {
    key: "standings" as const,
    href: "/",
    label: "Standings",
    animateIcon: "trophy" as const,
  },
  { key: "players" as const, href: "/", icon: IconPeople, label: "Players" },
  { key: "tournament" as const, href: "/", icon: IconTournament, label: "Tournament" },
  {
    key: "store" as const,
    href: "/",
    label: "Store",
    animateIcon: "cart" as const,
  },
  { key: "settings" as const, href: "/", icon: IconGear, label: "Settings" },
];

export function SidebarNav() {
  return (
    <div className={styles.sidebarShell}>
      <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>
        <Link href="/" className={styles.brandLogoLink}>
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
      </div>
      </aside>
    </div>
  );
}

export function BottomNav() {
  const items = [
    { key: "dashboard" as const, icon: IconDashboard, href: "/" },
    { key: "roster" as const, icon: IconShirt, href: "/" },
    { key: "matches" as const, icon: IconCalendar, href: "/" },
    { key: "players" as const, icon: IconPeople, href: "/" },
    { key: "more" as const, icon: IconDots, href: "/" },
  ];
  return (
    <nav className={styles.bottomNav} aria-label="Primary">
      <ul className={styles.bottomList}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.key === "dashboard";
          return (
            <li key={item.key}>
              <Link
                className={active ? styles.bottomLinkActive : styles.bottomLink}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                <Icon />
                <span>{t(`nav.${item.key}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
