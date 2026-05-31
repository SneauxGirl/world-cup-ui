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

const CHART_HEIGHT = 72;
const VOLUME_HEIGHT = 10;
const BODY_WIDTH = 14;

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
  const min = scaleMin ?? Math.min(candle.low, candle.open, candle.close) - 2;
  const max = scaleMax ?? Math.max(candle.high, candle.open, candle.close) + 2;
  const range = Math.max(max - min, 1);

  const toY = (value: number) =>
    CHART_HEIGHT - ((value - min) / range) * CHART_HEIGHT;

  const openY = toY(candle.open);
  const closeY = toY(candle.close);
  const highY = toY(candle.high);
  const lowY = toY(candle.low);
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
  const centerX = compact ? 18 : 24;
  const volumeMax = 480;
  const volumeWidth = (candle.minutesPlayed / volumeMax) * (compact ? 28 : 36);
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
        viewBox={`0 0 ${compact ? 36 : 48} ${CHART_HEIGHT + (showVolume ? VOLUME_HEIGHT + 4 : 0)}`}
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
          x={centerX - BODY_WIDTH / 2}
          y={bodyTop}
          width={BODY_WIDTH}
          height={bodyHeight}
          rx={1}
        />
        {showVolume ? (
          <rect
            className={styles.volume}
            x={centerX - volumeWidth / 2}
            y={CHART_HEIGHT + 4}
            width={volumeWidth}
            height={VOLUME_HEIGHT}
            rx={1}
          />
        ) : null}
      </svg>
      <span className={styles.tooltip} role="tooltip">
        {tooltip}
      </span>
    </div>
  );
}
