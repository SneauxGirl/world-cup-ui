/** Shared layout breakpoints (px). */
export const MOBILE_MAX_WIDTH_PX = 768;
/** Site header bar collapses to hamburger at this width (login + dashboard). */
export const SITE_HEADER_COLLAPSE_MAX_WIDTH_PX = 400;
export const SIDEBAR_MIN_WIDTH_PX = 1200;

export function mediaMaxWidthQuery(maxWidthPx: number): string {
  return `(max-width: ${maxWidthPx}px)`;
}
