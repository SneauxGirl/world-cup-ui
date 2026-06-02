import type { DashboardMatch } from "@/data/types";
import type { BannerDateSegment } from "@/lib/todayMatches";

/** Floor width for fit counting and `.gameWrap` — games grow above this via flex. */
export const BANNER_MIN_GAME_WIDTH_PX = 130;

export const BANNER_DIVIDER_WIDTH_PX = 1;

export type BannerStripItem =
  | { kind: "date"; dateId: string }
  | { kind: "game"; match: DashboardMatch }
  | { kind: "divider" };

export function buildBannerStripItems(segments: BannerDateSegment[]): BannerStripItem[] {
  const items: BannerStripItem[] = [];

  segments.forEach((segment, segmentIndex) => {
    if (segmentIndex > 0) {
      items.push({ kind: "divider" });
      items.push({ kind: "date", dateId: segment.dateId });
    } else {
      items.push({ kind: "date", dateId: segment.dateId });
    }
    segment.matches.forEach((match) => {
      items.push({ kind: "game", match });
    });
  });

  return items;
}

export function countBannerItemsThatFit(
  availableWidth: number,
  items: BannerStripItem[],
  minDateWidth: number,
  minGameWidth: number,
  dividerWidth = 1,
): number {
  if (availableWidth <= 0 || items.length === 0) return 0;

  let used = 0;
  let count = 0;

  for (const item of items) {
    const width =
      item.kind === "date"
        ? minDateWidth
        : item.kind === "game"
          ? minGameWidth
          : dividerWidth;

    if (count > 0 && used + width > availableWidth) break;

    used += width;
    count += 1;
  }

  return count;
}
