"use client";

import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { ValueTrendTemplate } from "@/data/types";
import {
  getCandleTrend,
  getCurrentCandle,
  formatTrendDelta,
  getCandleDelta,
  isCandleVolatile,
} from "@/lib/value-trends/compute";
import { ValueTrendCandleChart } from "@/components/dashboard/value-trends/ValueTrendCandleChart";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendStripCard.module.scss";

type Props = {
  slotId: string;
  slotLabel: string;
  player?: SquadPlayerPoolEntry;
  template: ValueTrendTemplate;
  onOpen: () => void;
};

export function ValueTrendStripCard({
  slotId,
  slotLabel,
  player,
  template,
  onOpen,
}: Props) {
  const candle = getCurrentCandle(template.candles);
  const trend = getCandleTrend(candle, template.rollingAverage);
  const volatile = isCandleVolatile(candle);
  const delta = getCandleDelta(candle);
  const deltaClass = volatile ? "volatile" : trend;
  const displayName = player?.lastName.toUpperCase() ?? slotLabel;
  const titleId = `value-trend-${slotId}-title`;

  return (
    <article className={styles.cardFrame} aria-labelledby={titleId}>
        <button
          type="button"
          className={styles.openBtn}
          onClick={onOpen}
          aria-label={t("valueTrends.openPlayerDetail", { player: displayName })}
        >
          <ValueTrendCandleChart
            candle={candle}
            trend={trend}
            rollingAverage={template.rollingAverage}
            compact
            showVolume={false}
            labelledBy={titleId}
          />
          <span id={titleId} className={styles.name}>
            {displayName}
          </span>
          <span className={styles.meta}>
            {player ? (
              <>
                {player.position}
                <span aria-hidden="true"> · </span>
                {player.teamCode}
              </>
            ) : (
              slotLabel
            )}
          </span>
          <span className={[styles.delta, styles[`delta_${deltaClass}`]].join(" ")}>
            {formatTrendDelta(delta)}
          </span>
        </button>
    </article>
  );
}
