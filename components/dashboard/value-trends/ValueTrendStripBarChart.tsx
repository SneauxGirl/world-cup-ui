"use client";

import type { ValueTrendTemplate } from "@/data/types";
import {
  buildStripSummaryCandle,
  clampStripPlotValue,
  formatTrendDelta,
  getCandleDelta,
  getStripAverageTotalPointsPerGame,
  getStripLastGameTotal,
  STRIP_PLOT_SCALE,
} from "@/lib/value-trends/compute";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendStripBarChart.module.scss";

export const STRIP_BAR_CHART_WIDTH = 40;
export const STRIP_BAR_CHART_HEIGHT = 96;

const CHART_WIDTH = STRIP_BAR_CHART_WIDTH;
const CHART_HEIGHT = STRIP_BAR_CHART_HEIGHT;
const BAR_WIDTH = 14;
const BAR_GAP = 4;
const AVG_BAR_X = (CHART_WIDTH - BAR_WIDTH * 2 - BAR_GAP) / 2;
const LAST_BAR_X = AVG_BAR_X + BAR_WIDTH + BAR_GAP;
const MIN_BAR_HEIGHT = 3;

type Props = {
  template: ValueTrendTemplate;
  scaleMin?: number;
  scaleMax?: number;
  className?: string;
};

function toBarHeight(
  value: number,
  min: number,
  max: number,
): number {
  const clamped = clampStripPlotValue(value, min, max);
  const range = Math.max(max - min, 1);
  const scaled = ((clamped - min) / range) * CHART_HEIGHT;
  return Math.max(MIN_BAR_HEIGHT, scaled);
}

export function ValueTrendStripBarChart({
  template,
  scaleMin = STRIP_PLOT_SCALE.min,
  scaleMax = STRIP_PLOT_SCALE.max,
  className,
}: Props) {
  const candle = buildStripSummaryCandle(template);
  const lastGameTotal = getStripLastGameTotal(template);
  const averageTotal = getStripAverageTotalPointsPerGame(template);
  const lastAboveAverage = lastGameTotal >= averageTotal;

  const avgBarHeight = toBarHeight(averageTotal, scaleMin, scaleMax);
  const lastBarHeight = toBarHeight(lastGameTotal, scaleMin, scaleMax);
  const avgBarY = CHART_HEIGHT - avgBarHeight;
  const lastBarY = CHART_HEIGHT - lastBarHeight;

  const tooltip = t("valueTrends.stripCandleTooltip", {
    games: candle.gameEnd,
    low: candle.low.toFixed(1),
    high: candle.high.toFixed(1),
    open: candle.open.toFixed(1),
    close: candle.close.toFixed(1),
    delta: formatTrendDelta(getCandleDelta(candle)),
    minutes: candle.minutesPlayed,
    avgAppearance: (candle.minutesBarPlotPoints ?? 0).toFixed(1),
    avgTotal: averageTotal.toFixed(1),
  });

  const ariaLabel = t("valueTrends.stripBarAria", {
    last: lastGameTotal.toFixed(1),
    avg: averageTotal.toFixed(1),
  });

  return (
    <div
      className={[
        styles.chart,
        lastAboveAverage ? styles.lastAbove : styles.lastBelow,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={tooltip}
    >
      <svg
        className={styles.svg}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
      >
        <rect
          className={styles.avgBar}
          x={AVG_BAR_X}
          y={avgBarY}
          width={BAR_WIDTH}
          height={avgBarHeight}
        />
        <rect
          className={styles.lastBar}
          x={LAST_BAR_X}
          y={lastBarY}
          width={BAR_WIDTH}
          height={lastBarHeight}
        />
      </svg>
      <span className={styles.tooltip} role="tooltip">
        {tooltip}
      </span>
    </div>
  );
}
