"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CountryFlag } from "@/components/CountryFlag";
import { IconClose } from "@/components/icons/DashboardIcons";
import { ValueTrendCandleChart } from "@/components/dashboard/value-trends/ValueTrendCandleChart";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { ValueTrendTemplate } from "@/data/types";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import {
  formatAvgPoints,
  getCandleTrend,
  getCurrentCandle,
  minutesToPlotPoints,
} from "@/lib/value-trends/compute";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import { t } from "@/lib/i18n/t";
import styles from "./ValueTrendDetailModal.module.scss";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  slotLabel: string;
  player?: SquadPlayerPoolEntry;
  template: ValueTrendTemplate;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

function getMatchBarTone(points: number): string {
  if (points >= 16) return styles.barHigh;
  if (points >= 10) return styles.barMid;
  if (points >= 0) return styles.barLow;
  return styles.barNegative;
}

export function ValueTrendDetailModal({
  open,
  onClose,
  slotLabel,
  player,
  template,
  closeButtonRef,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const internalCloseRef = useRef<HTMLButtonElement>(null);
  const closeRef = closeButtonRef ?? internalCloseRef;
  const titleId = useId();
  const descriptionId = useId();

  const displayName = player?.lastName.toUpperCase() ?? slotLabel;
  const jerseySrc = player ? getTeamJerseyPath(player.teamCode) : "/Players/White.png";
  const currentCandle = getCurrentCandle(template.candles);
  const currentTrend = getCandleTrend(currentCandle, template.rollingAverage);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const shell = shellRef.current;
    if (!shell) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !shell) return;

      const focusables = Array.from(
        shell.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, handleClose, closeRef]);

  if (!open || typeof document === "undefined") return null;

  const scaleMin = Math.min(...template.candles.flatMap((c) => [c.low, c.open, c.close])) - 2;
  const scaleMax = Math.max(...template.candles.flatMap((c) => [c.high, c.open, c.close])) + 2;

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.frame}>
          <div className={styles.panel}>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label={t("valueTrends.closeDetail")}
              onClick={handleClose}
            >
              <IconClose />
            </button>

            <div className={styles.hero}>
              <span className={styles.avgBadge}>
                {formatAvgPoints(template.rollingAverage)} {t("valueTrends.avgLabel")}
              </span>
              <div className={styles.portraitWrap}>
                <Image
                  src={jerseySrc}
                  alt=""
                  width={320}
                  height={420}
                  className={styles.portrait}
                  sizes="(max-width: 768px) 55vw, 280px"
                />
              </div>
              <div className={styles.identity}>
                <h2 id={titleId} className={styles.playerName}>
                  {displayName}
                </h2>
                <p className={styles.playerMeta}>
                  {player ? (
                    <>
                      <span>{player.position}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{player.teamCode}</span>
                      <CountryFlag code={player.teamCode} className={styles.flag} />
                    </>
                  ) : (
                    slotLabel
                  )}
                </p>
              </div>
            </div>

            <div className={styles.body}>
              <section className={styles.block} aria-labelledby={`${titleId}-matches`}>
                <div className={styles.blockHead}>
                  <h3 id={`${titleId}-matches`} className={styles.blockTitle}>
                    {t("valueTrends.lastFiveMatches")}
                  </h3>
                </div>
                <ul className={styles.matchBars}>
                  {template.lastFiveMatchPoints.map((points, index) => {
                    const minutes = template.lastFiveMatchMinutes[index] ?? 0;
                    const appearancePts = minutesToPlotPoints(minutes);
                    const total = points + appearancePts;

                    return (
                      <li key={index} className={styles.matchBarItem}>
                        <span className={styles.matchPts}>
                          {total >= 0 ? "+" : ""}
                          {total}
                        </span>
                        <span
                          className={[styles.matchBar, getMatchBarTone(total)].join(" ")}
                          style={{ height: `${Math.max(18, Math.min(100, total * 4))}%` }}
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className={styles.block} aria-labelledby={`${titleId}-stats`}>
                <div className={styles.blockHead}>
                  <h3 id={`${titleId}-stats`} className={styles.blockTitle}>
                    {t("valueTrends.overLastFiveGames")}
                  </h3>
                </div>
                <ul className={styles.statList}>
                  {template.keyStats.map((stat) => {
                    const filled = Math.round((stat.value / stat.max) * 12);
                    return (
                      <li key={stat.labelKey} className={styles.statRow}>
                        <span className={styles.statLabel}>
                          {t(`valueTrends.stats.${stat.labelKey}`)}
                        </span>
                        <span className={styles.statTrack} aria-hidden="true">
                          {Array.from({ length: 12 }, (_, index) => (
                            <span
                              key={index}
                              className={[
                                styles.statSegment,
                                index < filled ? styles.statSegmentFilled : "",
                              ].join(" ")}
                            />
                          ))}
                        </span>
                        <span className={styles.statValue}>{stat.value}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className={styles.block} aria-labelledby={`${titleId}-candles`}>
                <div className={styles.blockHead}>
                  <h3 id={`${titleId}-candles`} className={styles.blockTitle}>
                    {t("valueTrends.formWindows")}
                  </h3>
                </div>
                <ul className={styles.candleRow}>
                  {template.candles.map((candle) => {
                    const trend = getCandleTrend(candle, template.rollingAverage);
                    return (
                      <li key={candle.windowIndex} className={styles.candleItem}>
                        <span className={styles.windowLabel}>
                          {candle.gameStart}–{candle.gameEnd}
                        </span>
                        <ValueTrendCandleChart
                          candle={candle}
                          trend={trend}
                          rollingAverage={template.rollingAverage}
                          scaleMin={scaleMin}
                          scaleMax={scaleMax}
                          compact
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className={styles.expectedRow}>
                <span className={styles.expectedLabel}>{t("valueTrends.expectedPoints")}</span>
                <span className={styles.expectedValue}>
                  +{template.expectedPoints.toFixed(1)}
                </span>
              </div>

              <section className={styles.insightBlock} aria-labelledby={`${titleId}-insight`}>
                <h3 id={`${titleId}-insight`} className={styles.insightTitle}>
                  {t("valueTrends.insightTitle")}
                </h3>
                <ul id={descriptionId} className={styles.insightList}>
                  {template.insightLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                  <li className={styles.insightTrend}>
                    {t("valueTrends.currentTrendLabel")}: {t(`valueTrends.trend.${currentTrend}`)}
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
