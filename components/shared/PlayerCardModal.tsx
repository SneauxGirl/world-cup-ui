"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CountryFlag } from "@/components/CountryFlag";
import { ValueTrendCandleChart } from "@/components/dashboard/value-trends/ValueTrendCandleChart";
import { ValueTrendInfoModal } from "@/components/dashboard/value-trends/ValueTrendInfoModal";
import { IconClose, IconInfo } from "@/components/icons/DashboardIcons";
import {
  formatStatCell,
  getRosterPlayerStats,
  ROSTER_STAT_HIGHLIGHT_KEY,
  ROSTER_STAT_KEYS,
} from "@/data/roster-player-stats";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { ValueTrendTemplate } from "@/data/types";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import type { PlayerCardState } from "@/lib/player-card/PlayerCardProvider";
import {
  formatAvgPoints,
  getCandleTrend,
  getCandleWindowAverage,
  getCurrentCandle,
  minutesToPlotPoints,
} from "@/lib/value-trends/compute";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import styles from "./PlayerCardModal.module.scss";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POSITION_LABEL: Record<SquadPlayerPoolEntry["position"], string> = {
  GKP: "GK",
  DEF: "DEF",
  MID: "MID",
  FWD: "FWD",
};

type Props = {
  state: PlayerCardState | null;
  onClose: () => void;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

function getMatchBarTone(points: number): string {
  if (points >= 16) return styles.barHigh;
  if (points >= 10) return styles.barMid;
  if (points >= 0) return styles.barLow;
  return styles.barNegative;
}

function getDisplayName(player?: SquadPlayerPoolEntry, slotLabel?: string): string {
  if (player) {
    const full = `${player.firstName} ${player.lastName}`.trim();
    if (full) return full.toUpperCase();
    if (player.lastName) return player.lastName.toUpperCase();
  }
  return slotLabel ?? "";
}

export function PlayerCardModal({ state, onClose, closeButtonRef }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const internalCloseRef = useRef<HTMLButtonElement>(null);
  const closeRef = closeButtonRef ?? internalCloseRef;
  const titleId = useId();
  const descriptionId = useId();
  const seasonStatsId = useId();
  const [valueTrendsInfoOpen, setValueTrendsInfoOpen] = useState(false);

  const open = state !== null && Boolean(state.player ?? state.template);
  const player = state?.player;
  const template = state?.template;
  const slotLabel = state?.slotLabel;

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

      if (event.key !== "Tab") return;

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

  useEffect(() => {
    if (!open) {
      setValueTrendsInfoOpen(false);
    }
  }, [open]);

  if (!open || !state || typeof document === "undefined") return null;

  const displayName = getDisplayName(player, slotLabel);
  const jerseySrc = player ? getTeamJerseyPath(player.teamCode) : "/Players/White.png";
  const positionLabel = player ? POSITION_LABEL[player.position] : null;
  const seasonStats = player ? getRosterPlayerStats(player.id, player.position) : null;
  const currentCandle = template ? getCurrentCandle(template.candles) : null;
  const currentTrend =
    template && currentCandle
      ? getCandleTrend(currentCandle, template.rollingAverage)
      : null;
  const scaleMin = template
    ? Math.min(...template.candles.flatMap((c) => [c.low, c.open, c.close])) - 2
    : 0;
  const scaleMax = template
    ? Math.max(...template.candles.flatMap((c) => [c.high, c.open, c.close])) + 2
    : 0;

  return (
    <>
      {createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={template ? descriptionId : seasonStatsId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.frame}>
          <div className={styles.panel}>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label={t("playerCard.close")}
              onClick={handleClose}
            >
              <IconClose />
            </button>

            <div className={styles.hero}>
              {player ? (
                <span className={styles.pointsBadge}>
                  {t("player.points", { pts: formatInteger(player.fantasyPoints) })}
                </span>
              ) : null}
              {template ? (
                <span className={styles.avgBadge}>
                  {formatAvgPoints(template.rollingAverage)} {t("valueTrends.avgLabel")}
                </span>
              ) : null}
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
                  {player && positionLabel ? (
                    <>
                      <span>{positionLabel}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{player.teamCode}</span>
                      <CountryFlag
                        code={player.teamCode}
                        label={player.countryName}
                        className={styles.flag}
                      />
                    </>
                  ) : (
                    slotLabel
                  )}
                </p>
                {player && player.squadNumber > 0 ? (
                  <p className={styles.squadNumber}>
                    {t("playerCard.squadNumber", { number: player.squadNumber })}
                  </p>
                ) : null}
              </div>
            </div>

            {template ? (
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
                  <ul className={styles.formStatList}>
                    {template.keyStats.map((stat) => {
                      const filled = Math.round((stat.value / stat.max) * 12);
                      return (
                        <li key={stat.labelKey} className={styles.formStatRow}>
                          <span className={styles.formStatLabel}>
                            {t(`valueTrends.stats.${stat.labelKey}`)}
                          </span>
                          <span className={styles.formStatTrack} aria-hidden="true">
                            {Array.from({ length: 12 }, (_, index) => (
                              <span
                                key={index}
                                className={[
                                  styles.formStatSegment,
                                  index < filled ? styles.formStatSegmentFilled : "",
                                ].join(" ")}
                              />
                            ))}
                          </span>
                          <span className={styles.formStatValue}>{stat.value}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className={styles.block} aria-labelledby={`${titleId}-candles`}>
                  <div className={styles.blockHead}>
                    <div className={styles.blockTitleRow}>
                      <h3 id={`${titleId}-candles`} className={styles.blockTitle}>
                        {t("valueTrends.title")}
                      </h3>
                      <button
                        type="button"
                        className={styles.infoBtn}
                        aria-label={t("valueTrends.openInfoModal")}
                        onClick={() => setValueTrendsInfoOpen(true)}
                      >
                        <IconInfo className={styles.infoIcon} aria-hidden="true" />
                      </button>
                    </div>
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
                            fluid
                            className={styles.candleChart}
                          />
                          <span className={styles.windowAverage}>
                            {formatAvgPoints(getCandleWindowAverage(candle))}
                          </span>
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
                    {currentTrend ? (
                      <li className={styles.insightTrend}>
                        {t("valueTrends.currentTrendLabel")}:{" "}
                        {t(`valueTrends.trend.${currentTrend}`)}
                      </li>
                    ) : null}
                  </ul>
                </section>
              </div>
            ) : null}

            {player && seasonStats ? (
              <section
                className={styles.seasonStatsSection}
                aria-labelledby={seasonStatsId}
              >
                <h3 id={seasonStatsId} className={styles.seasonStatsTitle}>
                  {t("playerCard.seasonStats")}
                </h3>
                <dl className={styles.seasonStatsGrid}>
                  {ROSTER_STAT_KEYS.map((key) => {
                    const isHighlight = key === ROSTER_STAT_HIGHLIGHT_KEY;
                    return (
                      <div
                        key={key}
                        className={[
                          styles.seasonStatItem,
                          isHighlight && styles.seasonStatItemHighlight,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <dt
                          className={styles.seasonStatLabel}
                          title={t(`playerStats.statTitle.${key}`)}
                        >
                          {t(`playerStats.statAbbr.${key}`)}
                        </dt>
                        <dd className={styles.seasonStatValue}>
                          {formatStatCell(seasonStats[key])}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
      )}
      <ValueTrendInfoModal
        open={valueTrendsInfoOpen}
        onClose={() => setValueTrendsInfoOpen(false)}
      />
    </>
  );
}
