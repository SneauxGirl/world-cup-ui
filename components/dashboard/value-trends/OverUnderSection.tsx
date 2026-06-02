"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { OverUnderInfoModal } from "@/components/dashboard/value-trends/OverUnderInfoModal";
import { ValueTrendStripPlot } from "@/components/dashboard/value-trends/ValueTrendStripPlot";
import { IconChevronRight, IconInfo } from "@/components/icons/DashboardIcons";
import {
  buildValueTrendStripItems,
  type ValueTrendStripItem,
} from "@/lib/value-trends/buildStripItems";
import { getStripPlotScale } from "@/lib/value-trends/compute";
import { usePlayerCard } from "@/lib/player-card/PlayerCardProvider";
import { useRoster } from "@/lib/roster/RosterProvider";
import { t } from "@/lib/i18n/t";
import styles from "./OverUnderSection.module.scss";

type Props = {
  className?: string;
};

export function OverUnderSection({ className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { rosterBySlot, isDemoMode, loading } = useRoster();
  const { openPlayerCard } = usePlayerCard();
  const [infoOpen, setInfoOpen] = useState(false);

  const items = useMemo(
    () => buildValueTrendStripItems(rosterBySlot, isDemoMode),
    [rosterBySlot, isDemoMode],
  );

  const stripScale = getStripPlotScale();

  const handleOpenItem = useCallback(
    (item: ValueTrendStripItem) => {
      openPlayerCard({
        player: item.player,
        template: item.template,
        slotLabel: item.slotLabel,
      });
    },
    [openPlayerCard],
  );

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
              onOpenItem={handleOpenItem}
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
      <OverUnderInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />

    </>
  );
}
