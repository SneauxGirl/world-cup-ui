"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ValueTrendDetailModal } from "@/components/dashboard/value-trends/ValueTrendDetailModal";
import { ValueTrendStripCard } from "@/components/dashboard/value-trends/ValueTrendStripCard";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import {
  buildValueTrendHighlights,
  buildValueTrendStripItems,
  type ValueTrendStripItem,
} from "@/lib/value-trends/buildStripItems";
import { formatTrendDelta } from "@/lib/value-trends/compute";
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

  const items = useMemo(
    () => buildValueTrendStripItems(rosterBySlot, isDemoMode),
    [rosterBySlot, isDemoMode],
  );

  const highlights = useMemo(() => buildValueTrendHighlights(items), [items]);

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("article");
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
              <h2 id="value-trends-heading" className={styles.title}>
                {t("valueTrends.title")}
              </h2>
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

            <div ref={scrollerRef} className={styles.scroller}>
              {items.map((item) => (
                <ValueTrendStripCard
                  key={item.slotId}
                  slotId={item.slotId}
                  slotLabel={item.slotLabel}
                  player={item.player}
                  template={item.template}
                  onOpen={() => setActiveItem(item)}
                />
              ))}
            </div>
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
