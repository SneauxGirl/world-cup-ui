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
  positionFilter: SquadPositionCode | null;
  teamCodeFilter: string | null;
  onPositionFilterChange: (position: SquadPositionCode | null) => void;
  onTeamCodeFilterChange: (teamCode: string | null) => void;
};

export function SquadPlayerFilters({
  positionFilter,
  teamCodeFilter,
  onPositionFilterChange,
  onTeamCodeFilterChange,
}: Props) {
  const teams = getSquadPlayerTeams();

  return (
    <div className={styles.filters}>
      <section className={styles.section} aria-labelledby="squad-filter-global">
        <h4 id="squad-filter-global" className={styles.sectionLabel}>
          {t("squadSelection.filterGlobal")}
        </h4>
        <div className={styles.optionRow}>
          <button type="button" className={styles.optionActive} aria-pressed="true">
            {t("squadSelection.filterAllPlayers")}
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="squad-filter-position">
        <h4 id="squad-filter-position" className={styles.sectionLabel}>
          {t("squadSelection.filterPosition")}
        </h4>
        <div className={styles.optionRow}>
          {POSITION_OPTIONS.map((option) => {
            const isActive = positionFilter === option.code;
            return (
              <button
                key={option.code}
                type="button"
                className={isActive ? styles.optionActive : styles.option}
                aria-pressed={isActive}
                onClick={() =>
                  onPositionFilterChange(isActive ? null : option.code)
                }
              >
                {t(`squadSelection.${option.labelKey}`)}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="squad-filter-teams">
        <h4 id="squad-filter-teams" className={styles.sectionLabel}>
          {t("squadSelection.filterTeams")}
        </h4>
        <div className={styles.teamGrid} role="list">
          <button
            type="button"
            className={teamCodeFilter === null ? styles.teamActive : styles.team}
            aria-pressed={teamCodeFilter === null}
            onClick={() => onTeamCodeFilterChange(null)}
          >
            <span className={styles.teamName}>{t("squadSelection.filterAllTeams")}</span>
          </button>
          {teams.map((team) => {
            const isActive = teamCodeFilter === team.teamCode;
            return (
              <button
                key={team.teamCode}
                type="button"
                role="listitem"
                className={isActive ? styles.teamActive : styles.team}
                aria-pressed={isActive}
                onClick={() =>
                  onTeamCodeFilterChange(isActive ? null : team.teamCode)
                }
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
      </section>
    </div>
  );
}
