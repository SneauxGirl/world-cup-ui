"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardAppNavItems } from "@/data/dashboard-app-nav-items";
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

const sidebarNavItems = dashboardAppNavItems.map((item) => {
  switch (item.key) {
    case "dashboard":
      return { ...item, icon: IconDashboard, label: "Dashboard" };
    case "roster":
      return { ...item, icon: IconShirt, label: "My Roster" };
    case "matches":
      return { ...item, icon: IconCalendar, label: "Matches" };
    case "standings":
      return { ...item, label: "Standings", animateIcon: "trophy" as const };
    case "players":
      return { ...item, icon: IconPeople, label: "Players" };
    case "tournament":
      return { ...item, icon: IconTournament, label: "Tournament" };
    case "store":
      return { ...item, label: "Store", animateIcon: "cart" as const };
    case "settings":
      return { ...item, icon: IconGear, label: "Settings" };
    default:
      return { ...item, label: item.key };
  }
});

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
