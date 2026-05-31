import type { ValueTrendCandle, ValueTrendTrend } from "@/data/types";

export const VOLATILE_RANGE = 20;

export function isCandleVolatile(candle: ValueTrendCandle): boolean {
  return candle.high - candle.low > VOLATILE_RANGE;
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

export function getCandleDelta(candle: ValueTrendCandle): number {
  return candle.close - candle.open;
}

export function getCandleRange(candle: ValueTrendCandle): number {
  return candle.high - candle.low;
}

export function formatTrendDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}`;
}

export function formatAvgPoints(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}
