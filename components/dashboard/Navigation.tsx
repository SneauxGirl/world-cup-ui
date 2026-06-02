"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconDashboard,
  IconGear,
  IconPeople,
  IconShirt,
  IconTournament,
} from "@/components/icons/DashboardIcons";
import { SidebarNavLink } from "@/components/dashboard/SidebarNavLink";
import { getDashboardAppNavActiveKey } from "@/lib/dashboard-app-nav";
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

export function SidebarNav() {
  const pathname = usePathname();
  const activeKey = getDashboardAppNavActiveKey(pathname);

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
      </aside>
    </div>
  );
}
