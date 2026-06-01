"use client";

import type { ValueTrendStripItem } from "@/lib/value-trends/buildStripItems";
import {
  buildStripSummaryCandle,
  formatTrendDelta,
  getCandleDelta,
  getCandleTrend,
  isCandleVolatile,
  STRIP_VOLATILE_RANGE,
} from "@/lib/value-trends/compute";
import { ValueTrendCandleChart } from "@/components/dashboard/value-trends/ValueTrendCandleChart";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendStripCard.module.scss";

type ChartCellProps = {
  item: ValueTrendStripItem;
  scaleMin: number;
  scaleMax: number;
  onOpen: () => void;
};

type LabelCellProps = {
  item: ValueTrendStripItem;
  onOpen: () => void;
};

function useStripItemState(item: ValueTrendStripItem) {
  const candle = buildStripSummaryCandle(item.template);
  const trend = getCandleTrend(candle, item.template.rollingAverage);
  const volatile = isCandleVolatile(candle, STRIP_VOLATILE_RANGE);
  const delta = getCandleDelta(candle);
  const deltaClass = volatile ? "volatile" : trend;
  const displayName = item.player?.lastName.toUpperCase() ?? item.slotLabel;
  const titleId = `value-trend-${item.slotId}-title`;

  return { candle, trend, delta, deltaClass, displayName, titleId };
}

export function ValueTrendStripChartCell({
  item,
  scaleMin,
  scaleMax,
  onOpen,
}: ChartCellProps) {
  const { candle, trend, displayName } = useStripItemState(item);

  return (
    <div className={styles.chartCell}>
      <button
        type="button"
        className={styles.chartBtn}
        onClick={onOpen}
        aria-label={t("valueTrends.openPlayerDetail", { player: displayName })}
      >
        <ValueTrendCandleChart
          candle={candle}
          trend={trend}
          rollingAverage={item.template.rollingAverage}
          template={item.template}
          scaleMin={scaleMin}
          scaleMax={scaleMax}
          compact
          stripMode
          showVolume
        />
      </button>
    </div>
  );
}

export function ValueTrendStripLabelCell({ item, onOpen }: LabelCellProps) {
  const { delta, deltaClass, displayName, titleId } = useStripItemState(item);

  return (
    <div className={styles.labelCell}>
      <button
        type="button"
        className={styles.labelBtn}
        onClick={onOpen}
      >
        <span id={titleId} className={styles.name}>
          {displayName}
        </span>
        <span className={styles.meta}>
          {item.player ? (
            <>
              {item.player.position}
              <span aria-hidden="true"> · </span>
              {item.player.teamCode}
            </>
          ) : (
            item.slotLabel
          )}
        </span>
        <span className={[styles.delta, styles[`delta_${deltaClass}`]].join(" ")}>
          {formatTrendDelta(delta)}
        </span>
      </button>
    </div>
  );
}
