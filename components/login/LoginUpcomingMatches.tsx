"use client";

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CountryFlag } from "@/components/CountryFlag";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/icons/DashboardIcons";
import { liveMatches, userDashboard } from "@/data/dashboard-seed";
import type { DashboardMatch } from "@/data/types";
import {
  buildFixtureDates,
  defaultFixtureDateIndex,
  matchesForFixtureDate,
} from "@/lib/fixtureSchedule";
import { formatKickoffTime } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./LoginUpcomingMatches.module.scss";

const MATCH_TABS = ["games", "standings", "bracket"] as const;
type MatchTabKey = (typeof MATCH_TABS)[number];

function matchTimeLabel(match: DashboardMatch): { label: string; dateTime?: string } {
  if (match.status === "upcoming" && /^\d{4}-\d{2}-\d{2}T/.test(match.clockLabel)) {
    return {
      label: formatKickoffTime(match.clockLabel),
      dateTime: match.clockLabel,
    };
  }
  return { label: match.clockLabel };
}

function MatchBlock({ match }: { match: DashboardMatch }) {
  const { label, dateTime } = matchTimeLabel(match);

  return (
    <article className={styles.matchBlock}>
      <div className={styles.matchBody}>
        <ul className={styles.teamList}>
          <li className={styles.teamRow}>
            <CountryFlag
              code={match.home.code}
              label={match.home.name}
              className={styles.teamFlag}
            />
            <span className={styles.teamName}>{match.home.name}</span>
            <span className={styles.teamScore} aria-label={t("loginMatches.homeScore")}>
              {match.homeScore}
            </span>
          </li>
          <li className={styles.teamRow}>
            <CountryFlag
              code={match.away.code}
              label={match.away.name}
              className={styles.teamFlag}
            />
            <span className={styles.teamName}>{match.away.name}</span>
            <span className={styles.teamScore} aria-label={t("loginMatches.awayScore")}>
              {match.awayScore}
            </span>
          </li>
        </ul>
        <span className={styles.matchDivider} aria-hidden="true" />
        <time className={styles.matchTime} dateTime={dateTime}>
          {label}
        </time>
      </div>
    </article>
  );
}

function getMatchesScrollStep(scroller: HTMLElement): number {
  const col = scroller.querySelector<HTMLElement>("[data-match-col]");
  if (!col) return 280;
  return col.offsetWidth;
}

export function LoginUpcomingMatches() {
  const matchesScrollerRef = useRef<HTMLDivElement | null>(null);
  const fixtureDates = useMemo(() => buildFixtureDates(liveMatches), []);
  const [activeTab, setActiveTab] = useState<MatchTabKey>("games");
  const [dateIndex, setDateIndex] = useState(() => defaultFixtureDateIndex(fixtureDates));

  const selectedDate = fixtureDates[dateIndex] ?? fixtureDates[0];
  const matches = useMemo(
    () => (selectedDate ? matchesForFixtureDate(liveMatches, selectedDate.id) : []),
    [selectedDate],
  );

  const shiftDates = (delta: number) => {
    if (fixtureDates.length === 0) return;
    setDateIndex((index) => {
      const next = index + delta;
      if (next < 0) return fixtureDates.length - 1;
      if (next >= fixtureDates.length) return 0;
      return next;
    });
  };

  const scrollMatches = useCallback((direction: -1 | 1) => {
    const scroller = matchesScrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * getMatchesScrollStep(scroller),
      behavior: "auto",
    });
  }, []);

  const focusTab = useCallback((tabKey: MatchTabKey) => {
    document.getElementById(`login-match-tab-${tabKey}`)?.focus();
  }, []);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, tabKey: MatchTabKey) => {
      const currentIndex = MATCH_TABS.indexOf(tabKey);
      let nextIndex: number | null = null;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % MATCH_TABS.length;
          break;
        case "ArrowLeft":
          nextIndex = (currentIndex - 1 + MATCH_TABS.length) % MATCH_TABS.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = MATCH_TABS.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextTab = MATCH_TABS[nextIndex];
      setActiveTab(nextTab);
      focusTab(nextTab);
    },
    [focusTab],
  );

  const handleMatchesKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const scroller = matchesScrollerRef.current;
      if (!scroller) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          scrollMatches(1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          scrollMatches(-1);
          break;
        case "Home":
          event.preventDefault();
          scroller.scrollLeft = 0;
          break;
        case "End":
          event.preventDefault();
          scroller.scrollLeft = scroller.scrollWidth;
          break;
        default:
          break;
      }
    },
    [scrollMatches],
  );

  return (
    <section className={styles.section} aria-labelledby="login-upcoming-matches-heading">
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <h2 id="login-upcoming-matches-heading" className={styles.brandTitle}>
            {t("loginMatches.worldCup")}
          </h2>
          <div className={styles.seasonMeta}>
            <p className={styles.seasonLine}>{t("loginMatches.season")}</p>
            <p className={styles.stageLine}>{userDashboard.roundLabel}</p>
          </div>
        </header>

        <div
          className={styles.tabStrip}
          role="tablist"
          aria-label={t("loginMatches.tabsLabel")}
        >
          {MATCH_TABS.map((tabKey) => {
            const isActive = activeTab === tabKey;
            return (
              <div
                key={tabKey}
                className={[
                  styles.tabCell,
                  isActive && styles.tabCellActive,
                  isActive && styles[`tabCellActive_${tabKey}`],
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <button
                  type="button"
                  role="tab"
                  id={`login-match-tab-${tabKey}`}
                  aria-selected={isActive}
                  aria-controls="login-match-tabpanel"
                  className={[
                    styles.tab,
                    isActive && styles.tabActive,
                    isActive && styles[`tabActive_${tabKey}`],
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setActiveTab(tabKey)}
                  onKeyDown={(event) => handleTabKeyDown(event, tabKey)}
                >
                  {t(`loginMatches.tabs.${tabKey}`)}
                </button>
              </div>
            );
          })}
        </div>

        <div
          id="login-match-tabpanel"
          role="tabpanel"
          aria-labelledby={`login-match-tab-${activeTab}`}
          className={styles.tabPanel}
        >
          {activeTab === "games" && selectedDate ? (
            <>
              <div className={styles.dateRow}>
                <div className={styles.monthBlock}>
                  <p className={styles.monthName}>{selectedDate.monthLabel}</p>
                  <p className={styles.monthYear}>{selectedDate.yearLabel}</p>
                </div>

                <div className={styles.dateScroller}>
                  <button
                    type="button"
                    className={styles.dateNavBtn}
                    aria-label={t("loginMatches.prevDates")}
                    onClick={() => shiftDates(-1)}
                  >
                    <IconChevronLeft className={styles.dateNavIcon} />
                  </button>

                  <ul className={styles.dateList}>
                    {fixtureDates.map((date, index) => {
                      const isSelected = index === dateIndex;
                      return (
                        <li key={date.id}>
                          <button
                            type="button"
                            className={[
                              styles.dateBtn,
                              isSelected && styles.dateBtnActive,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            aria-pressed={isSelected}
                            onClick={() => setDateIndex(index)}
                          >
                            <span className={styles.dateWeekday}>{date.weekdayLabel}</span>
                            <span className={styles.dateDay}>{date.dayLabel}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    type="button"
                    className={styles.dateNavBtn}
                    aria-label={t("loginMatches.nextDates")}
                    onClick={() => shiftDates(1)}
                  >
                    <IconChevronRight className={styles.dateNavIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.matchesDivider} aria-hidden="true" />

              <p id="login-matches-scroller-hint" className={styles.scrollerHint}>
                {t("loginMatches.matchesScrollerHint")}
              </p>

              <div
                ref={matchesScrollerRef}
                className={styles.matchesRow}
                role="region"
                tabIndex={0}
                aria-label={t("loginMatches.matchesScrollerLabel")}
                aria-describedby="login-matches-scroller-hint"
                onKeyDown={handleMatchesKeyDown}
              >
                {matches.map((match, index) => (
                  <div key={match.id} className={styles.matchCol} data-match-col>
                    {index > 0 ? (
                      <span className={styles.matchColDivider} aria-hidden="true" />
                    ) : null}
                    <MatchBlock match={match} />
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === "games" ? null : (
            <p className={styles.tabPlaceholder}>{t("loginMatches.comingSoon")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
