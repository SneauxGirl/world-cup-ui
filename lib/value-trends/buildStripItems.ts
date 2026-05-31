import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import { squadPitchFormation } from "@/data/squad-pitch-formation";
import type { ValueTrendTemplate } from "@/data/types";
import { getTemplateForSlot, getSlotLabel } from "@/data/value-trends-templates";
import {
  getCandleDelta,
  getCandleRange,
  getCurrentCandle,
} from "@/lib/value-trends/compute";

export type ValueTrendStripItem = {
  slotId: string;
  slotLabel: string;
  player?: SquadPlayerPoolEntry;
  template: ValueTrendTemplate;
};

export function buildValueTrendStripItems(
  rosterBySlot: Record<string, SquadPlayerPoolEntry>,
  isDemoMode: boolean,
): ValueTrendStripItem[] {
  const slots = isDemoMode
    ? squadPitchFormation
    : squadPitchFormation.filter((slot) => rosterBySlot[slot.id]);

  return slots.map((slot) => ({
    slotId: slot.id,
    slotLabel: getSlotLabel(slot.id),
    player: rosterBySlot[slot.id],
    template: getTemplateForSlot(slot.id, isDemoMode),
  }));
}

export type ValueTrendHighlight = {
  kind: "riser" | "faller" | "volatile";
  slotId: string;
  label: string;
  delta: number;
};

export function buildValueTrendHighlights(
  items: ValueTrendStripItem[],
): ValueTrendHighlight[] {
  if (items.length === 0) return [];

  const scored = items.map((item) => {
    const candle = getCurrentCandle(item.template.candles);
    return {
      item,
      delta: getCandleDelta(candle),
      range: getCandleRange(candle),
      label: item.player?.lastName ?? item.slotLabel,
    };
  });

  const riser = [...scored].sort((a, b) => b.delta - a.delta)[0];
  const faller = [...scored].sort((a, b) => a.delta - b.delta)[0];
  const volatile = [...scored].sort((a, b) => b.range - a.range)[0];

  const highlights: ValueTrendHighlight[] = [];

  if (riser && riser.delta > 0) {
    highlights.push({
      kind: "riser",
      slotId: riser.item.slotId,
      label: riser.label,
      delta: riser.delta,
    });
  }

  if (faller && faller.delta < 0) {
    highlights.push({
      kind: "faller",
      slotId: faller.item.slotId,
      label: faller.label,
      delta: faller.delta,
    });
  }

  if (volatile && volatile.range > 20) {
    highlights.push({
      kind: "volatile",
      slotId: volatile.item.slotId,
      label: volatile.label,
      delta: volatile.range,
    });
  }

  return highlights;
}
