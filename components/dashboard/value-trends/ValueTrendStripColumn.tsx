"use client";

import type { ValueTrendStripItem } from "@/lib/value-trends/buildStripItems";
import {
  ValueTrendStripChartCell,
  ValueTrendStripLabelCell,
} from "@/components/dashboard/value-trends/ValueTrendStripCard";
import styles from "./ValueTrendStripColumn.module.scss";

type Props = {
  item: ValueTrendStripItem;
  scaleMin: number;
  scaleMax: number;
  onOpen: () => void;
};

export function ValueTrendStripColumn({ item, scaleMin, scaleMax, onOpen }: Props) {
  return (
    <div className={styles.column} data-value-trend-column>
      <ValueTrendStripChartCell
        item={item}
        scaleMin={scaleMin}
        scaleMax={scaleMax}
        onOpen={onOpen}
      />
      <ValueTrendStripLabelCell item={item} onOpen={onOpen} />
    </div>
  );
}
