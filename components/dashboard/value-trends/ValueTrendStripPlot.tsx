"use client";

import { useCallback, useId, useRef, type CSSProperties, type KeyboardEvent } from "react";
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
};

function formatTick(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ValueTrendStripPlot({ scale, items }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const hintId = useId();

  const plotStyle = {
    ["--value-trend-plot-height" as string]: `${STRIP_BAR_CHART_HEIGHT}px`,
    ["--value-trend-column-width" as string]: "5rem",
  } as CSSProperties;

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-value-trend-column]");
    const delta = card ? card.getBoundingClientRect().width + 12 : 120;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

  const handleScrollerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          scrollByCard(1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          scrollByCard(-1);
          break;
        case "Home":
          event.preventDefault();
          scroller.scrollLeft = 0;
          break;
        case "End":
          event.preventDefault();
          scroller.scrollLeft = scroller.scrollWidth;
          break;
        default:
          break;
      }
    },
    [scrollByCard],
  );

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
      <p id={hintId} className={styles.scrollerHint}>
        {t("valueTrends.stripScrollerHint")}
      </p>

      <div className={styles.axisCaptionRow} aria-hidden="true">
        <span className={styles.axisCaption}>{t("valueTrends.pointsAxis")}</span>
      </div>

      <div className={styles.plotRow}>
        <div className={styles.yAxis} aria-hidden="true">
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

          <div
            ref={scrollerRef}
            className={styles.scroller}
            role="region"
            tabIndex={0}
            aria-label={t("valueTrends.stripScrollerLabel")}
            aria-describedby={hintId}
            onKeyDown={handleScrollerKeyDown}
          >
            {items.map((item) => (
              <ValueTrendStripColumn
                key={item.slotId}
                item={item}
                scaleMin={scale.min}
                scaleMax={scale.max}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
