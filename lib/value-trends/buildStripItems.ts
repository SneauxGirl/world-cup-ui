import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import { squadPitchFormation } from "@/data/squad-pitch-formation";
import { squadPlayerPool } from "@/data/squad-player-pool";
import type { ValueTrendTemplate } from "@/data/types";
import { getTemplateForPlayer } from "@/lib/player-fantasy/buildTemplate";
import { getSlotLabel } from "@/lib/value-trends/slotLabels";
import {
  getStripLastGameVsAverageDelta,
  getStripVolatilityRange,
} from "@/lib/value-trends/compute";

export type ValueTrendStripItem = {
  slotId: string;
  slotLabel: string;
  player?: SquadPlayerPoolEntry;
  template: ValueTrendTemplate;
};

function emptyTemplate(): ValueTrendTemplate {
  return {
    rollingAverage: 0,
    candles: [],
    lastFiveMatchPoints: [],
    lastFiveMatchMinutes: [],
    keyStats: [],
    expectedPoints: 0,
    insightLines: [],
  };
}

function demoPlayerForSlot(slotId: string): SquadPlayerPoolEntry | undefined {
  const slot = squadPitchFormation.find((entry) => entry.id === slotId);
  if (!slot) return undefined;

  const candidates = squadPlayerPool.filter((player) => player.position === slot.position);
  if (candidates.length === 0) return undefined;

  const match = slotId.match(/-(\d+)$/);
  const slotIndex = match ? Number.parseInt(match[1], 10) - 1 : 0;
  return candidates[slotIndex % candidates.length];
}

function templateForItem(player?: SquadPlayerPoolEntry): ValueTrendTemplate {
  if (!player) return emptyTemplate();
  return getTemplateForPlayer(player.id, player.position) ?? emptyTemplate();
}

export function buildValueTrendStripItems(
  rosterBySlot: Record<string, SquadPlayerPoolEntry>,
  isDemoMode: boolean,
): ValueTrendStripItem[] {
  const slots = isDemoMode
    ? squadPitchFormation
    : squadPitchFormation.filter((slot) => rosterBySlot[slot.id]);

  return slots.map((slot) => {
    const player = isDemoMode ? demoPlayerForSlot(slot.id) : rosterBySlot[slot.id];
    return {
      slotId: slot.id,
      slotLabel: getSlotLabel(slot.id),
      player,
      template: templateForItem(player),
    };
  });
}

export type ValueTrendHighlight = {
  kind: "riser" | "faller" | "volatile";
  playerId: string;
  label: string;
  delta: number;
};

export function buildValueTrendHighlightsFromItems(
  items: ValueTrendStripItem[],
): ValueTrendHighlight[] {
  if (items.length === 0) return [];

  const scored = items
    .filter((item) => item.player)
    .map((item) => {
      return {
        item,
        delta: getStripLastGameVsAverageDelta(item.template),
        range: getStripVolatilityRange(item.template),
        label: item.player?.lastName ?? item.slotLabel,
        playerId: item.player!.id,
      };
    });

  if (scored.length === 0) return [];

  const riser = [...scored].sort((a, b) => b.delta - a.delta)[0];
  const faller = [...scored].sort((a, b) => a.delta - b.delta)[0];
  const volatile = [...scored].sort((a, b) => b.range - a.range)[0];

  const highlights: ValueTrendHighlight[] = [];

  if (riser && riser.delta > 0) {
    highlights.push({
      kind: "riser",
      playerId: riser.playerId,
      label: riser.label,
      delta: riser.delta,
    });
  }

  if (faller && faller.delta < 0) {
    highlights.push({
      kind: "faller",
      playerId: faller.playerId,
      label: faller.label,
      delta: faller.delta,
    });
  }

  if (volatile && volatile.range > 0) {
    highlights.push({
      kind: "volatile",
      playerId: volatile.playerId,
      label: volatile.label,
      delta: volatile.range,
    });
  }

  return highlights;
}

export function buildGlobalValueTrendHighlights(): ValueTrendHighlight[] {
  const items: ValueTrendStripItem[] = squadPlayerPool.map((player) => ({
    slotId: player.id,
    slotLabel: player.lastName,
    player,
    template: templateForItem(player),
  }));
  return buildValueTrendHighlightsFromItems(items);
}

export function buildRosterValueTrendHighlights(
  rosterBySlot: Record<string, SquadPlayerPoolEntry>,
): ValueTrendHighlight[] {
  const rosterPlayers = Object.values(rosterBySlot);
  const items: ValueTrendStripItem[] = rosterPlayers.map((player) => ({
    slotId: player.id,
    slotLabel: player.lastName,
    player,
    template: templateForItem(player),
  }));
  return buildValueTrendHighlightsFromItems(items);
}

/** @deprecated Use buildValueTrendHighlightsFromItems or buildGlobal/Roster helpers. */
export function buildValueTrendHighlights(
  items: ValueTrendStripItem[],
): ValueTrendHighlight[] {
  return buildValueTrendHighlightsFromItems(items);
}
