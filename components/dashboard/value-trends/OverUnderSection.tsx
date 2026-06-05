"use client";

import { useMemo, useState } from "react";
import { OverUnderInfoModal } from "@/components/dashboard/value-trends/OverUnderInfoModal";
import { ValueTrendStripPlot } from "@/components/dashboard/value-trends/ValueTrendStripPlot";
import { IconInfo } from "@/components/icons/DashboardIcons";
import { buildValueTrendStripItems } from "@/lib/value-trends/buildStripItems";
import { getStripPlotScale } from "@/lib/value-trends/compute";
import { useRoster } from "@/lib/roster/RosterProvider";
import { t } from "@/lib/i18n/t";
import styles from "./OverUnderSection.module.scss";

type Props = {
  className?: string;
};

export function OverUnderSection({ className }: Props) {
  const { rosterBySlot, isDemoMode, loading } = useRoster();
  const [infoOpen, setInfoOpen] = useState(false);

  const items = useMemo(
    () => buildValueTrendStripItems(rosterBySlot, isDemoMode),
    [rosterBySlot, isDemoMode],
  );

  const stripScale = getStripPlotScale();

  if (loading) return null;

  return (
    <>
      <section
        className={[styles.sectionFrame, className].filter(Boolean).join(" ")}
        aria-labelledby="value-trends-heading"
      >
        <div
          className={[styles.section, isDemoMode && styles.sectionDemo]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.content} inert={isDemoMode ? true : undefined}>
            <div className={styles.head}>
              <div className={styles.titleRow}>
                <h2 id="value-trends-heading" className={styles.title}>
                  {t("valueTrends.title")}
                </h2>
                <button
                  type="button"
                  className={styles.infoBtn}
                  aria-label={t("valueTrends.openInfoModal")}
                  onClick={() => setInfoOpen(true)}
                >
                  <IconInfo className={styles.infoIcon} />
                </button>
              </div>
            </div>

            <ValueTrendStripPlot scale={stripScale} items={items} />
          </div>
        </div>
      </section>
      <OverUnderInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
