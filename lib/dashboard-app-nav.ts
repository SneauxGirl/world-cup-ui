/** Keys for in-app dashboard shell nav (sidebar + mobile drawer). */
export type DashboardAppNavKey =
  | "dashboard"
  | "roster"
  | "matches"
  | "standings"
  | "players"
  | "tournament"
  | "store"
  | "settings";

/**
 * Which nav item is current — by route, not href.
 * Unbuilt sections use `#` as a placeholder href (not a real route).
 */
export function getDashboardAppNavActiveKey(pathname: string): DashboardAppNavKey | null {
  if (pathname === "/roster") return "roster";
  if (pathname === "/dashboard") return "dashboard";
  return null;
}
