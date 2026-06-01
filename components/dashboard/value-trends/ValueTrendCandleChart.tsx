"use client";

import { useId } from "react";
import type { ValueTrendCandle, ValueTrendTrend } from "@/data/types";
import type { ValueTrendTemplate } from "@/data/types";
import {
  clampStripPlotValue,
  formatTrendDelta,
  getCandleDelta,
  getStripAverageTotalPointsPerGame,
  isCandleVolatile,
  STRIP_PLOT_SCALE,
  STRIP_VOLATILE_RANGE,
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
  stripMode?: boolean;
  showVolume?: boolean;
  className?: string;
  labelledBy?: string;
  template?: ValueTrendTemplate;
};

export const STRIP_CHART_WIDTH = 40;
export const STRIP_CHART_HEIGHT = 96;

const STRIP_WIDTH = STRIP_CHART_WIDTH;
const STRIP_HEIGHT = STRIP_CHART_HEIGHT;
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
  stripMode = false,
  showVolume = true,
  className,
  labelledBy,
  template,
}: Props) {
  const clipId = useId();
  const volatile = isCandleVolatile(
    candle,
    stripMode ? STRIP_VOLATILE_RANGE : undefined,
  );
  const chartWidth = compact ? STRIP_WIDTH : FULL_WIDTH;
  const chartHeight = compact ? STRIP_HEIGHT : FULL_HEIGHT;
  const bodyWidth = compact ? STRIP_BODY : FULL_BODY;
  const centerX = chartWidth / 2;

  const usesFixedStripScale =
    stripMode ||
    (compact &&
      scaleMin === STRIP_PLOT_SCALE.min &&
      scaleMax === STRIP_PLOT_SCALE.max);

  const min = scaleMin ?? Math.min(candle.low, candle.open, candle.close) - 2;
  const max = scaleMax ?? Math.max(candle.high, candle.open, candle.close) + 2;
  const range = Math.max(max - min, 1);

  const toPlotValue = (value: number) =>
    usesFixedStripScale ? clampStripPlotValue(value) : value;

  const toY = (value: number) =>
    chartHeight - ((toPlotValue(value) - min) / range) * chartHeight;

  const baselineY = chartHeight;
  const openY = toY(candle.open);
  const closeY = toY(candle.close);
  const highY = toY(candle.high);
  const lowY = Math.min(toY(candle.low), baselineY);
  const bodyTop = Math.min(openY, closeY);
  const bodyBottom = Math.max(openY, closeY);
  const bodyHeight = Math.max(
    usesFixedStripScale ? bodyBottom - bodyTop : Math.abs(closeY - openY),
    compact ? 4 : 2,
  );
  const minutesPlotPoints = candle.minutesPlotPoints ?? 0;
  const minutesBarValue =
    candle.minutesBarPlotPoints ??
    minutesPlotPoints / Math.max(candle.gameEnd, 1);
  const volumeMax = 480;
  const volumeWidth = (candle.minutesPlayed / volumeMax) * (compact ? 32 : 28);
  const stripMinutesBarTop =
    usesFixedStripScale && minutesBarValue > 0 ? toY(minutesBarValue) : chartHeight;
  const stripMinutesBarHeight = chartHeight - stripMinutesBarTop;
  const stripMinutesBarY = stripMinutesBarTop;
  const volumeBlock =
    showVolume && (!compact || (stripMode && minutesBarValue > 0));
  const viewHeight = chartHeight + (showVolume && !compact && !stripMode ? FULL_VOLUME_HEIGHT + 4 : 0);
  const delta = getCandleDelta(candle);

  const tooltip = stripMode
    ? t("valueTrends.stripCandleTooltip", {
        games: candle.gameEnd,
        low: candle.low.toFixed(1),
        high: candle.high.toFixed(1),
        delta: formatTrendDelta(delta),
        minutes: candle.minutesPlayed,
        avgAppearance: (candle.minutesBarPlotPoints ?? 0).toFixed(1),
        avgTotal: template
          ? getStripAverageTotalPointsPerGame(template).toFixed(1)
          : rollingAverage.toFixed(1),
      })
    : t("valueTrends.candleTooltip", {
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
        usesFixedStripScale ? styles.stripPlot : "",
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
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label={tooltip}
      >
        {usesFixedStripScale ? (
          <defs>
            <clipPath id={clipId}>
              <rect x={0} y={0} width={chartWidth} height={chartHeight} />
            </clipPath>
          </defs>
        ) : null}
        <g clipPath={usesFixedStripScale ? `url(#${clipId})` : undefined}>
          {volumeBlock && stripMode ? (
            <rect
              className={styles.volume}
              x={centerX - bodyWidth / 2}
              y={stripMinutesBarY}
              width={bodyWidth}
              height={Math.max(stripMinutesBarHeight, 0)}
              rx={0.75}
            />
          ) : null}
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
        </g>
        {volumeBlock && !stripMode ? (
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
