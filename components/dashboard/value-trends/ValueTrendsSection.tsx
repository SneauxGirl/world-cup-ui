"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ValueTrendDetailModal } from "@/components/dashboard/value-trends/ValueTrendDetailModal";
import { ValueTrendInfoModal } from "@/components/dashboard/value-trends/ValueTrendInfoModal";
import { ValueTrendStripPlot } from "@/components/dashboard/value-trends/ValueTrendStripPlot";
import { IconChevronRight, IconInfo } from "@/components/icons/DashboardIcons";
import {
  buildValueTrendHighlights,
  buildValueTrendStripItems,
  type ValueTrendStripItem,
} from "@/lib/value-trends/buildStripItems";
import { formatTrendDelta, getStripPlotScale } from "@/lib/value-trends/compute";
import { useRoster } from "@/lib/roster/RosterProvider";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendsSection.module.scss";

type Props = {
  className?: string;
};

export function ValueTrendsSection({ className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { rosterBySlot, isDemoMode, loading } = useRoster();
  const [activeItem, setActiveItem] = useState<ValueTrendStripItem | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const items = useMemo(
    () => buildValueTrendStripItems(rosterBySlot, isDemoMode),
    [rosterBySlot, isDemoMode],
  );

  const highlights = useMemo(() => buildValueTrendHighlights(items), [items]);

  const stripScale = getStripPlotScale();

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-value-trend-column]");
    const delta = card ? card.getBoundingClientRect().width + 12 : 120;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

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
            ) : null}

            <div className={styles.controls}>
              <span className={styles.navBtnFrame}>
                <button
                  type="button"
                  className={styles.navBtn}
                  aria-label={t("dashboard.previousSlide")}
                  onClick={() => scrollByCard(-1)}
                >
                  <IconChevronRight className={styles.flip} />
                </button>
              </span>
              <span className={styles.navBtnFrame}>
                <button
                  type="button"
                  className={styles.navBtn}
                  aria-label={t("dashboard.nextSlide")}
                  onClick={() => scrollByCard(1)}
                >
                  <IconChevronRight />
                </button>
              </span>
            </div>

            <ValueTrendStripPlot
              scale={stripScale}
              items={items}
              scrollerRef={scrollerRef}
              onOpenItem={setActiveItem}
            />
          </div>

          {isDemoMode ? (
            <div
              className={styles.demoOverlay}
              role="region"
              aria-label={t("valueTrends.demoOverlayLabel")}
            >
              <div className={styles.demoPromptFrame}>
                <div className={styles.demoPrompt}>
                  <p className={styles.demoPromptText}>{t("valueTrends.demoBanner")}</p>
                  <Link className={styles.demoPromptLink} href="/roster">
                    {t("dashboard.setYourRoster")}
                    <IconChevronRight
                      className={styles.demoPromptIcon}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ValueTrendInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />

      {activeItem ? (
        <ValueTrendDetailModal
          open
          onClose={() => setActiveItem(null)}
          slotLabel={activeItem.slotLabel}
          player={activeItem.player}
          template={activeItem.template}
        />
      ) : null}
    </>
  );
}
