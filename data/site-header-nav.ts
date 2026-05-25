/** Shown in the header bar at mobile widths; rest go in the drawer. */
export const SITE_HEADER_MOBILE_PINNED_KEYS = ["standings", "news"] as const;

/** Primary header links; `more` is the overflow bucket (not in this list). */
export const siteHeaderNavItems = [
  { key: "scoresFixtures" as const, href: "/", hasMenu: false },
  { key: "standings" as const, href: "/", hasMenu: false },
  { key: "teams" as const, href: "/", hasMenu: false },
  { key: "news" as const, href: "/", hasMenu: false },
  { key: "hostCities" as const, href: "/", hasMenu: true },
  { key: "tickets" as const, href: "/", hasMenu: false },
  { key: "hospitality" as const, href: "/", hasMenu: false },
  { key: "fanHub" as const, href: "/", hasMenu: true },
] as const;

export type SiteHeaderNavItem = (typeof siteHeaderNavItems)[number];

export const SITE_HEADER_MORE_KEY = "more" as const;

export function isSiteHeaderMobilePinned(key: string): boolean {
  return (SITE_HEADER_MOBILE_PINNED_KEYS as readonly string[]).includes(key);
}

export function getSiteHeaderMobilePinnedItems() {
  return siteHeaderNavItems.filter((item) => isSiteHeaderMobilePinned(item.key));
}

export function getSiteHeaderMobileDrawerItems() {
  return siteHeaderNavItems.filter((item) => !isSiteHeaderMobilePinned(item.key));
}

