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
};

export function ValueTrendStripColumn({ item, scaleMin, scaleMax }: Props) {
  return (
    <div className={styles.column} data-value-trend-column>
      <ValueTrendStripChartCell item={item} scaleMin={scaleMin} scaleMax={scaleMax} />
      <ValueTrendStripLabelCell item={item} />
    </div>
  );
}
