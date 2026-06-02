import type { DashboardAppNavKey } from "@/lib/dashboard-app-nav";

export type DashboardAppNavItem = {
  key: DashboardAppNavKey;
  href: string;
};

/** In-app shell nav — sidebar (≥1200px) and header bar (769–1199px). */
export const dashboardAppNavItems: DashboardAppNavItem[] = [
  { key: "dashboard", href: "/dashboard" },
  { key: "roster", href: "/roster" },
  { key: "matches", href: "#" },
  { key: "standings", href: "#" },
  { key: "players", href: "#" },
  { key: "tournament", href: "#" },
  { key: "store", href: "#" },
  { key: "settings", href: "#" },
];
