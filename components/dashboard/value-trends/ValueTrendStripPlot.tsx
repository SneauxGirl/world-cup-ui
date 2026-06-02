"use client";

import type { CSSProperties, RefObject } from "react";
import { ValueTrendStripColumn } from "@/components/dashboard/value-trends/ValueTrendStripColumn";
import { STRIP_BAR_CHART_HEIGHT } from "@/components/dashboard/value-trends/ValueTrendStripBarChart";
import type { ValueTrendStripItem } from "@/lib/value-trends/buildStripItems";
import type { ValueTrendStripScale } from "@/lib/value-trends/compute";
import { valueToPlotPercent } from "@/lib/value-trends/compute";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendStripPlot.module.scss";

type Props = {
  scale: ValueTrendStripScale;
  items: ValueTrendStripItem[];
  scrollerRef: RefObject<HTMLDivElement | null>;
  onOpenItem: (item: ValueTrendStripItem) => void;
};

function formatTick(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ValueTrendStripPlot({
  scale,
  items,
  scrollerRef,
  onOpenItem,
}: Props) {
  const plotStyle = {
    ["--value-trend-plot-height" as string]: `${STRIP_BAR_CHART_HEIGHT}px`,
    ["--value-trend-column-width" as string]: "3.85rem",
  } as CSSProperties;

  return (
    <div
      className={styles.plot}
      style={plotStyle}
      role="group"
      aria-label={t("valueTrends.stripPlotLabel", {
        min: formatTick(scale.min),
        max: formatTick(scale.max),
      })}
    >
      <div className={styles.plotRow}>
        <div className={styles.yAxis} aria-hidden="true">
          <span className={styles.axisCaption}>{t("valueTrends.pointsAxis")}</span>
          <div className={styles.yAxisPlot}>
            {scale.ticks.map((tick) => (
              <span
                key={tick}
                className={styles.tickLabel}
                style={{ bottom: `${valueToPlotPercent(tick, scale.min, scale.max)}%` }}
              >
                {formatTick(tick)}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.plotMain}>
          <div className={styles.chartBand} aria-hidden="true">
            {scale.ticks.map((tick) => (
              <div
                key={tick}
                className={styles.gridLine}
                style={{ bottom: `${valueToPlotPercent(tick, scale.min, scale.max)}%` }}
              />
            ))}
          </div>

          <div ref={scrollerRef} className={styles.scroller}>
            {items.map((item) => (
              <ValueTrendStripColumn
                key={item.slotId}
                item={item}
                scaleMin={scale.min}
                scaleMax={scale.max}
                onOpen={() => onOpenItem(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
