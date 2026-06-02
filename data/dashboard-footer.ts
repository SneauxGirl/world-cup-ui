export type DashboardFooterNavItem = {
  id: string;
  href: string;
  labelKey: string;
};

export type DashboardFooterEchoNavItem = {
  id: string;
  href: string;
  labelKey: string;
  hasMenu?: boolean;
};

export const dashboardFooterNavColumns: readonly (readonly DashboardFooterNavItem[])[] = [
  [
    { id: "dashboard", href: "/dashboard", labelKey: "nav.dashboard" },
    { id: "standings", href: "#", labelKey: "nav.standings" },
  ],
  [
    { id: "roster", href: "/roster", labelKey: "nav.roster" },
    { id: "players", href: "#", labelKey: "nav.players" },
  ],
  [
    { id: "matches", href: "#", labelKey: "nav.matches" },
    { id: "tournament", href: "#", labelKey: "nav.tournament" },
  ],
] as const;

export function getDashboardFooterNavItemsRowMajor() {
  const rowCount = Math.max(...dashboardFooterNavColumns.map((column) => column.length));
  const items: DashboardFooterNavItem[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    for (const column of dashboardFooterNavColumns) {
      const item = column[row];
      if (item) items.push(item);
    }
  }

  return items;
}

export const dashboardFooterLegalLinks = [
  { id: "terms", href: "#", labelKey: "loginFooter.legal.terms" },
  { id: "policies", href: "#", labelKey: "loginFooter.legal.policies" },
  { id: "cookies", href: "#", labelKey: "loginFooter.legal.cookies" },
  { id: "contact", href: "#", labelKey: "loginFooter.legal.contact" },
] as const;

export const dashboardFooterEchoNavItems: readonly DashboardFooterEchoNavItem[] = [
  { id: "worldCup", href: "/dashboard", labelKey: "loginFooter.nav.worldCup" },
  { id: "teams", href: "/", labelKey: "footer.teams" },
  { id: "news", href: "/", labelKey: "footer.news" },
  { id: "hostCities", href: "/", labelKey: "footer.hostCities", hasMenu: true },
  { id: "tickets", href: "/", labelKey: "footer.tickets" },
  { id: "hospitality", href: "/", labelKey: "footer.hospitality" },
  { id: "fanHub", href: "/", labelKey: "footer.fanHub", hasMenu: true },
  { id: "settings", href: "#", labelKey: "nav.settings" },
] as const;
