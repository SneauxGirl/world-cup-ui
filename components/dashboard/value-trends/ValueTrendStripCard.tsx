"use client";

import type { ValueTrendStripItem } from "@/lib/value-trends/buildStripItems";
import {
  formatTrendDelta,
  getStripLastGameVsAverageDelta,
  getStripLastGameVsAverageTone,
} from "@/lib/value-trends/compute";
import { ValueTrendStripBarChart } from "@/components/dashboard/value-trends/ValueTrendStripBarChart";
import styles from "./ValueTrendStripCard.module.scss";

type ChartCellProps = {
  item: ValueTrendStripItem;
  scaleMin: number;
  scaleMax: number;
};

type LabelCellProps = {
  item: ValueTrendStripItem;
};

function useStripItemState(item: ValueTrendStripItem) {
  const delta = getStripLastGameVsAverageDelta(item.template);
  const deltaTone = getStripLastGameVsAverageTone(delta);
  const displayName = item.player?.lastName.toUpperCase() ?? item.slotLabel;
  const titleId = `value-trend-${item.slotId}-title`;

  return { delta, deltaTone, displayName, titleId };
}

export function ValueTrendStripChartCell({ item, scaleMin, scaleMax }: ChartCellProps) {
  return (
    <div className={styles.chartCell}>
      <div className={styles.chartBody}>
        <ValueTrendStripBarChart
          template={item.template}
          scaleMin={scaleMin}
          scaleMax={scaleMax}
        />
      </div>
    </div>
  );
}

export function ValueTrendStripLabelCell({ item }: LabelCellProps) {
  const { delta, deltaTone, displayName, titleId } = useStripItemState(item);

  return (
    <div className={styles.labelCell}>
      <div className={styles.labelBody}>
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
        <span className={[styles.delta, styles[`delta_${deltaTone}`]].join(" ")}>
          {formatTrendDelta(delta)}
        </span>
      </div>
    </div>
  );
}
