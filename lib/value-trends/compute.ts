import type { ValueTrendCandle, ValueTrendTemplate, ValueTrendTrend } from "@/data/types";

export const VOLATILE_RANGE = 20;
/** Min high–low spread on the strip (match pts + appearance pts) to flag volatile styling. */
export const STRIP_VOLATILE_RANGE = 12;

export function isCandleVolatile(
  candle: ValueTrendCandle,
  rangeThreshold = VOLATILE_RANGE,
): boolean {
  return candle.high - candle.low > rangeThreshold;
}

/** 1 appearance point per 5 minutes; any started 5-minute block counts (ceil). */
export function minutesToPlotPoints(minutes: number): number {
  if (minutes <= 0) return 0;
  return Math.ceil(minutes / 5);
}

export function sumMinutesPlotPoints(minutesPerGame: number[]): number {
  return minutesPerGame.reduce((sum, minutes) => sum + minutesToPlotPoints(minutes), 0);
}

export function isCandleElite(
  candle: ValueTrendCandle,
  rollingAverage: number,
): boolean {
  return (
    candle.low >= rollingAverage * 0.9 &&
    candle.close > candle.open &&
    !isCandleVolatile(candle)
  );
}

export function getCandleTrend(
  candle: ValueTrendCandle,
  rollingAverage: number,
): ValueTrendTrend {
  if (isCandleElite(candle, rollingAverage)) return "elite";
  if (candle.close > candle.open) return "bullish";
  return "bearish";
}

export function getCurrentCandle(candles: ValueTrendCandle[]): ValueTrendCandle {
  return candles[candles.length - 1];
}

export function buildGameTotals(
  matchPoints: number[],
  matchMinutes: number[],
): number[] {
  return matchPoints.map((points, index) => {
    const minutes = matchMinutes[index] ?? 0;
    return points + minutesToPlotPoints(minutes);
  });
}

/** Strip sparkline: last-five game totals (match pts + appearance pts). */
export function buildStripSummaryCandle(template: ValueTrendTemplate): ValueTrendCandle {
  const points = template.lastFiveMatchPoints;
  const minutes = template.lastFiveMatchMinutes;
  const last = getCurrentCandle(template.candles);

  if (points.length === 0) {
    return last;
  }

  const gameTotals = buildGameTotals(points, minutes);
  const minutesPlayed = minutes.length > 0
    ? minutes.reduce((sum, value) => sum + value, 0)
    : last.minutesPlayed;

  const appearanceTotal = sumMinutesPlotPoints(minutes);
  const gameCount = Math.max(points.length, 1);
  const windowAverage =
    Math.round((gameTotals.reduce((sum, value) => sum + value, 0) / gameCount) * 10) / 10;

  return {
    windowIndex: last.windowIndex,
    gameStart: 1,
    gameEnd: points.length,
    open: gameTotals[0],
    high: Math.max(...gameTotals),
    low: Math.min(...gameTotals),
    close: gameTotals[gameTotals.length - 1],
    minutesPlayed,
    /** Total appearance pts (last five games) — used in tooltips. */
    minutesPlotPoints: appearanceTotal,
    /** Avg appearance pts per game — scaled on the 0–40 strip for the base bar. */
    minutesBarPlotPoints: appearanceTotal / gameCount,
    windowAverage,
  };
}

/** Mean per-game total (match points + appearance pts) over the last five games. */
export function getStripAverageTotalPointsPerGame(template: ValueTrendTemplate): number {
  const points = template.lastFiveMatchPoints;
  const minutes = template.lastFiveMatchMinutes;
  if (points.length === 0) return 0;
  const totals = buildGameTotals(points, minutes);
  const sum = totals.reduce((total, value) => total + value, 0);
  return Math.round((sum / totals.length) * 10) / 10;
}

/** Most recent game total in the strip window (games 6–10). */
export function getStripLastGameTotal(template: ValueTrendTemplate): number {
  const points = template.lastFiveMatchPoints;
  const minutes = template.lastFiveMatchMinutes;
  if (points.length === 0) return 0;
  const totals = buildGameTotals(points, minutes);
  return totals[totals.length - 1];
}

export function getStripLastGameVsAverageDelta(template: ValueTrendTemplate): number {
  const lastGame = getStripLastGameTotal(template);
  const average = getStripAverageTotalPointsPerGame(template);
  return Math.round((lastGame - average) * 10) / 10;
}

export function getCandleDelta(candle: ValueTrendCandle): number {
  return candle.close - candle.open;
}

export function getCandleRange(candle: ValueTrendCandle): number {
  return candle.high - candle.low;
}

/** Mean per-game fantasy total for the games in this candle window. */
export function getCandleWindowAverage(candle: ValueTrendCandle): number {
  if (candle.windowAverage !== undefined) return candle.windowAverage;
  const gameCount = Math.max(candle.gameEnd - candle.gameStart + 1, 1);
  return Math.round(((candle.open + candle.close) / 2) * 10) / 10;
}

/** High–low spread of per-game match points only (no appearance minutes). */
export function getStripMatchPointsRange(template: ValueTrendTemplate): number {
  const points = template.lastFiveMatchPoints;
  if (points.length === 0) return 0;
  return Math.max(...points) - Math.min(...points);
}

/** Volatility for highlights — same high/low as the strip candle (match + appearance). */
export function getStripVolatilityRange(template: ValueTrendTemplate): number {
  return getCandleRange(buildStripSummaryCandle(template));
}

export function formatTrendDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}`;
}

export function formatAvgPoints(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

export type ValueTrendStripScale = {
  min: number;
  max: number;
  ticks: number[];
};

/** Fixed 0–40 pts scale for the dashboard Value Trends strip. */
export const STRIP_PLOT_SCALE: ValueTrendStripScale = {
  min: 0,
  max: 40,
  ticks: [0, 20, 40],
};

export function getStripPlotScale(): ValueTrendStripScale {
  return STRIP_PLOT_SCALE;
}

export function valueToPlotPercent(value: number, min: number, max: number): number {
  const range = Math.max(max - min, 1);
  return ((value - min) / range) * 100;
}

/** Clamp fantasy point values to the strip plot range (0–40). */
export function clampStripPlotValue(
  value: number,
  scaleMin = STRIP_PLOT_SCALE.min,
  scaleMax = STRIP_PLOT_SCALE.max,
): number {
  return Math.min(scaleMax, Math.max(scaleMin, value));
}
