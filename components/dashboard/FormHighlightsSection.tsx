"use client";

import { useMemo } from "react";
import {
  buildGlobalValueTrendHighlights,
  buildRosterValueTrendHighlights,
  type ValueTrendHighlight,
} from "@/lib/value-trends/buildStripItems";
import { formatTrendDelta } from "@/lib/value-trends/compute";
import { useRoster } from "@/lib/roster/RosterProvider";
import { ROSTER_TOP_PERFORMERS_MIN } from "@/lib/player-fantasy/topPerformers";
import { t } from "@/lib/i18n/t";
import styles from "./FormHighlightsSection.module.scss";

type Props = {
  className?: string;
};

function buildHighlights(
  rosterBySlot: Record<string, unknown>,
  rosterCount: number,
): ValueTrendHighlight[] {
  if (rosterCount >= ROSTER_TOP_PERFORMERS_MIN) {
    return buildRosterValueTrendHighlights(
      rosterBySlot as Parameters<typeof buildRosterValueTrendHighlights>[0],
    );
  }
  return buildGlobalValueTrendHighlights();
}

export function FormHighlightsSection({ className }: Props) {
  const { rosterBySlot, rosterCount, loading } = useRoster();

  const highlights = useMemo(
    () => buildHighlights(rosterBySlot, rosterCount),
    [rosterBySlot, rosterCount],
  );

  if (loading) return null;

  return (
    <section
      className={[styles.sectionFrame, className].filter(Boolean).join(" ")}
      aria-labelledby="form-highlights-heading"
    >
      <div className={styles.section}>
        <h2 id="form-highlights-heading" className={styles.srHeading}>
          {t("dashboard.formHighlights")}
        </h2>
        {highlights.length > 0 ? (
          <ul className={styles.chips} aria-label={t("valueTrends.highlightsLabel")}>
            {highlights.map((chip) => (
              <li key={chip.kind}>
                <span className={[styles.chip, styles[`chip_${chip.kind}`]].join(" ")}>
                  <span className={styles.chipLabel}>
                    {t(`valueTrends.chips.${chip.kind}`)}
                  </span>
                  <span className={styles.chipValue}>
                    {chip.label}
                    {chip.kind === "volatile"
                      ? ` · ${chip.delta.toFixed(0)} pt range`
                      : ` · ${formatTrendDelta(chip.delta)}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>{t("dashboard.formHighlightsEmpty")}</p>
        )}
      </div>
    </section>
  );
}
