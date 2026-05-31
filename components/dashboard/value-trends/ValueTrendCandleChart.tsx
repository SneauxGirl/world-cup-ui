"use client";

import type { ValueTrendCandle, ValueTrendTrend } from "@/data/types";
import {
  formatTrendDelta,
  getCandleDelta,
  isCandleVolatile,
} from "@/lib/value-trends/compute";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendCandleChart.module.scss";

type Props = {
  candle: ValueTrendCandle;
  trend: ValueTrendTrend;
  rollingAverage: number;
  scaleMax?: number;
  scaleMin?: number;
  compact?: boolean;
  showVolume?: boolean;
  className?: string;
  labelledBy?: string;
};

const STRIP_WIDTH = 40;
const STRIP_HEIGHT = 96;
const STRIP_BODY = 31;

const FULL_WIDTH = 40;
const FULL_HEIGHT = 72;
const FULL_BODY = 12;
const FULL_VOLUME_HEIGHT = 8;

function getTrendClass(trend: ValueTrendTrend, volatile: boolean): string {
  if (volatile) return styles.volatile;
  if (trend === "elite") return styles.elite;
  if (trend === "bullish") return styles.bullish;
  return styles.bearish;
}

export function ValueTrendCandleChart({
  candle,
  trend,
  rollingAverage,
  scaleMax,
  scaleMin,
  compact = false,
  showVolume = true,
  className,
  labelledBy,
}: Props) {
  const volatile = isCandleVolatile(candle);
  const chartWidth = compact ? STRIP_WIDTH : FULL_WIDTH;
  const chartHeight = compact ? STRIP_HEIGHT : FULL_HEIGHT;
  const bodyWidth = compact ? STRIP_BODY : FULL_BODY;
  const centerX = chartWidth / 2;

  const min = scaleMin ?? Math.min(candle.low, candle.open, candle.close) - 2;
  const max = scaleMax ?? Math.max(candle.high, candle.open, candle.close) + 2;
  const range = Math.max(max - min, 1);

  const toY = (value: number) => chartHeight - ((value - min) / range) * chartHeight;

  const openY = toY(candle.open);
  const closeY = toY(candle.close);
  const highY = toY(candle.high);
  const lowY = toY(candle.low);
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(closeY - openY), compact ? 6 : 2);
  const volumeMax = 480;
  const volumeWidth = (candle.minutesPlayed / volumeMax) * (compact ? 32 : 28);
  const volumeBlock = showVolume && !compact;
  const viewHeight = chartHeight + (volumeBlock ? FULL_VOLUME_HEIGHT + 4 : 0);
  const delta = getCandleDelta(candle);

  const tooltip = t("valueTrends.candleTooltip", {
    games: `${candle.gameStart}–${candle.gameEnd}`,
    open: candle.open.toFixed(1),
    high: candle.high.toFixed(1),
    low: candle.low.toFixed(1),
    close: candle.close.toFixed(1),
    delta: formatTrendDelta(delta),
    minutes: candle.minutesPlayed,
    avg: rollingAverage.toFixed(1),
  });

  return (
    <div
      className={[
        styles.chart,
        compact ? styles.compact : styles.full,
        getTrendClass(trend, volatile),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={tooltip}
      aria-labelledby={labelledBy}
    >
      <svg
        className={styles.svg}
        width={chartWidth}
        height={viewHeight}
        viewBox={`0 0 ${chartWidth} ${viewHeight}`}
        role="img"
        aria-label={tooltip}
      >
        <line
          className={styles.wick}
          x1={centerX}
          x2={centerX}
          y1={highY}
          y2={lowY}
        />
        <rect
          className={styles.body}
          x={centerX - bodyWidth / 2}
          y={bodyTop}
          width={bodyWidth}
          height={bodyHeight}
          rx={0.75}
        />
        {volumeBlock ? (
          <rect
            className={styles.volume}
            x={centerX - volumeWidth / 2}
            y={chartHeight + 4}
            width={volumeWidth}
            height={FULL_VOLUME_HEIGHT}
            rx={0.75}
          />
        ) : null}
      </svg>
      <span className={styles.tooltip} role="tooltip">
        {tooltip}
      </span>
    </div>
  );
}
