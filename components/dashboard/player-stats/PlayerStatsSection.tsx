"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import {
  compareRosterPlayers,
  formatStatCell,
  getRosterPlayerStats,
  ROSTER_STAT_HIGHLIGHT_KEY,
  ROSTER_STAT_KEYS,
} from "@/data/roster-player-stats";
import type { RosterPlayerStatKey } from "@/data/types";
import { useRoster } from "@/lib/roster/RosterProvider";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import { t } from "@/lib/i18n/t";
import styles from "./PlayerStatsSection.module.scss";

type Props = {
  className?: string;
};

type RosterStatsRow = {
  player: SquadPlayerPoolEntry;
  stats: ReturnType<typeof getRosterPlayerStats>;
};

const POSITION_LABEL: Record<SquadPositionCode, string> = {
  GKP: "GK",
  DEF: "DEF",
  MID: "MID",
  FWD: "FWD",
};

function buildRows(rosterBySlot: Record<string, SquadPlayerPoolEntry>): RosterStatsRow[] {
  const seen = new Set<string>();
  const rows: RosterStatsRow[] = [];

  for (const player of Object.values(rosterBySlot)) {
    if (seen.has(player.id)) continue;
    seen.add(player.id);
    rows.push({
      player,
      stats: getRosterPlayerStats(player.id, player.position),
    });
  }

  rows.sort((a, b) =>
    compareRosterPlayers(
      { position: a.player.position, stats: a.stats },
      { position: b.player.position, stats: b.stats },
    ),
  );

  return rows;
}

export function PlayerStatsSection({ className }: Props) {
  const { rosterBySlot, isDemoMode, loading } = useRoster();

  const rows = useMemo(() => buildRows(rosterBySlot), [rosterBySlot]);

  if (loading) return null;

  return (
    <section
      className={[styles.sectionFrame, className].filter(Boolean).join(" ")}
      aria-labelledby="player-stats-heading"
    >
      <div
        className={[styles.section, isDemoMode && styles.sectionDemo].filter(Boolean).join(" ")}
      >
        {isDemoMode ? (
          <div className={styles.demoOverlay}>
            <div className={styles.demoPromptFrame}>
              <div className={styles.demoPrompt}>
                <p className={styles.demoPromptText}>{t("playerStats.demoBanner")}</p>
                <Link href="/roster" className={styles.demoPromptLink}>
                  {t("playerStats.viewRoster")}
                  <IconChevronRight className={styles.demoPromptIcon} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.content} inert={isDemoMode ? true : undefined}>
          <header className={styles.head}>
            <h2 id="player-stats-heading" className={styles.title}>
              {t("playerStats.title")}
            </h2>
            <p className={styles.subtitle}>{t("playerStats.subtitle")}</p>
          </header>

          <div className={styles.tableWrap}>
            <div
              className={styles.tableScroller}
              role="region"
              aria-label={t("playerStats.tableLabel")}
              tabIndex={0}
            >
              <table className={styles.table}>
                <thead>
                  <tr className={styles.headerRow}>
                    <th scope="col" className={styles.playerHeadCell}>
                      <span className={styles.srOnly}>{t("playerStats.playerColumn")}</span>
                    </th>
                    {ROSTER_STAT_KEYS.map((key) => (
                      <StatHeader key={key} statKey={key} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <PlayerStatsTableRow key={row.player.id} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatHeader({ statKey }: { statKey: RosterPlayerStatKey }) {
  const isHighlight = statKey === ROSTER_STAT_HIGHLIGHT_KEY;
  return (
    <th
      scope="col"
      className={[styles.statHeadCell, isHighlight && styles.statHeadCellHighlight]
        .filter(Boolean)
        .join(" ")}
      title={t(`playerStats.statTitle.${statKey}`)}
    >
      {t(`playerStats.statAbbr.${statKey}`)}
    </th>
  );
}

function PlayerStatsTableRow({ row }: { row: RosterStatsRow }) {
  const { player, stats } = row;
  const jerseySrc = getTeamJerseyPath(player.teamCode);
  const displayName = `${player.firstName} ${player.lastName}`.trim();
  const positionLabel = POSITION_LABEL[player.position];

  return (
    <tr className={styles.bodyRow}>
      <th scope="row" className={styles.playerCell}>
        <div className={styles.playerBlock}>
          <span
            className={[styles.positionBadge, styles[`position_${player.position}`]].join(" ")}
            aria-hidden="true"
          >
            {positionLabel}
          </span>
          <span className={styles.avatar} aria-hidden="true">
            <Image
              src={jerseySrc}
              alt=""
              width={40}
              height={40}
              className={styles.avatarImg}
            />
          </span>
          <span className={styles.playerText}>
            <span className={styles.playerName}>{displayName}</span>
            <span className={styles.playerMeta}>
              {positionLabel} · {player.teamCode}
            </span>
          </span>
        </div>
      </th>
      {ROSTER_STAT_KEYS.map((key) => {
        const isHighlight = key === ROSTER_STAT_HIGHLIGHT_KEY;
        const raw = stats[key];
        return (
          <td
            key={key}
            className={[styles.statCell, isHighlight && styles.statCellHighlight]
              .filter(Boolean)
              .join(" ")}
          >
            {formatStatCell(raw)}
          </td>
        );
      })}
    </tr>
  );
}
