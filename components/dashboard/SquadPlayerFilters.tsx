"use client";

import Image from "next/image";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import { getSquadPlayerTeams } from "@/lib/squad-player-teams";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPlayerFilters.module.scss";

const POSITION_OPTIONS: { code: SquadPositionCode; labelKey: "filterGoalkeepers" | "filterDefenders" | "filterMidfielders" | "filterForwards" }[] = [
  { code: "GKP", labelKey: "filterGoalkeepers" },
  { code: "DEF", labelKey: "filterDefenders" },
  { code: "MID", labelKey: "filterMidfielders" },
  { code: "FWD", labelKey: "filterForwards" },
];

function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

type Props = {
  positionFilter: SquadPositionCode[];
  teamCodeFilter: string[];
  onPositionFilterChange: (positions: SquadPositionCode[]) => void;
  onTeamCodeFilterChange: (teamCodes: string[]) => void;
};

export function SquadPlayerFilters({
  positionFilter,
  teamCodeFilter,
  onPositionFilterChange,
  onTeamCodeFilterChange,
}: Props) {
  const teams = getSquadPlayerTeams();
  const positionPanelId = "squad-filter-position-panel";
  const teamsPanelId = "squad-filter-teams-panel";

  return (
    <div className={styles.filters}>
      <details className={styles.section}>
        <summary
          id="squad-filter-position"
          className={styles.sectionSummary}
          aria-controls={positionPanelId}
        >
          <span className={styles.sectionLabel}>{t("squadSelection.filterPosition")}</span>
        </summary>
        <div id={positionPanelId} className={styles.sectionContent}>
          <div className={styles.optionRow}>
            {POSITION_OPTIONS.map((option) => {
              const isActive = positionFilter.includes(option.code);
              return (
                <button
                  key={option.code}
                  type="button"
                  className={isActive ? styles.optionActive : styles.option}
                  aria-pressed={isActive}
                  onClick={() => {
                    if (isActive) {
                      onPositionFilterChange(
                        positionFilter.filter((code) => code !== option.code),
                      );
                      return;
                    }
                    onPositionFilterChange([...positionFilter, option.code]);
                  }}
                >
                  {t(`squadSelection.${option.labelKey}`)}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      <details className={styles.section}>
        <summary
          id="squad-filter-teams"
          className={styles.sectionSummary}
          aria-controls={teamsPanelId}
        >
          <span className={styles.sectionLabel}>{t("squadSelection.filterTeams")}</span>
        </summary>
        <div id={teamsPanelId} className={styles.sectionContent}>
          <div className={styles.teamGrid} role="list">
            {teams.map((team) => {
              const isActive = teamCodeFilter.includes(team.teamCode);
              return (
                <button
                  key={team.teamCode}
                  type="button"
                  role="listitem"
                  className={isActive ? styles.teamActive : styles.team}
                  aria-pressed={isActive}
                  onClick={() => {
                    if (isActive) {
                      onTeamCodeFilterChange(
                        teamCodeFilter.filter((code) => code !== team.teamCode),
                      );
                      return;
                    }
                    onTeamCodeFilterChange([...teamCodeFilter, team.teamCode]);
                  }}
                >
                  <Image
                    className={styles.teamFlag}
                    src={getFlagUrl(team.countryIso2)}
                    alt=""
                    width={22}
                    height={16}
                    aria-hidden
                  />
                  <span className={styles.teamName}>{team.countryName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}
