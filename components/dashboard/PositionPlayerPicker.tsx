"use client";

import { IconClose, IconPlus } from "@/components/icons/DashboardIcons";
import { PlayerCardTrigger } from "@/components/dashboard/player-card/PlayerCardTrigger";
import { usePlayerCard } from "@/lib/player-card/PlayerCardProvider";
import { squadPlayerPool, type SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import { SquadPlayerFilters } from "@/components/dashboard/SquadPlayerFilters";
import { SquadPlayerSearch } from "@/components/dashboard/SquadPlayerSearch";
import styles from "./PositionPlayerPicker.module.scss";

export type PositionPlayerPickerLayout = "overlay" | "sidebar";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  positionFilter: SquadPositionCode[];
  teamCodeFilter: string[];
  onPositionFilterChange: (positions: SquadPositionCode[]) => void;
  onTeamCodeFilterChange: (teamCodes: string[]) => void;
  layout?: PositionPlayerPickerLayout;
  showClose?: boolean;
  onClose?: () => void;
  onAddPlayer: (player: SquadPlayerPoolEntry) => void;
  isPlayerDisabled?: (player: SquadPlayerPoolEntry) => boolean;
};

function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

function sortByCountry(a: SquadPlayerPoolEntry, b: SquadPlayerPoolEntry): number {
  return a.countryName.localeCompare(b.countryName) || a.lastName.localeCompare(b.lastName);
}

function matchesSearch(player: SquadPlayerPoolEntry, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return (
    player.firstName.toLowerCase().includes(normalized) ||
    player.lastName.toLowerCase().includes(normalized) ||
    player.countryName.toLowerCase().includes(normalized) ||
    player.teamCode.toLowerCase().includes(normalized)
  );
}

export function PositionPlayerPicker({
  searchQuery,
  onSearchQueryChange,
  positionFilter,
  teamCodeFilter,
  onPositionFilterChange,
  onTeamCodeFilterChange,
  layout = "overlay",
  showClose = false,
  onClose,
  onAddPlayer,
  isPlayerDisabled,
}: Props) {
  const { openPlayer } = usePlayerCard();

  const players = squadPlayerPool
    .filter((player) => (positionFilter.length > 0 ? positionFilter.includes(player.position) : true))
    .filter((player) => (teamCodeFilter.length > 0 ? teamCodeFilter.includes(player.teamCode) : true))
    .filter((player) => matchesSearch(player, searchQuery))
    .sort(sortByCountry);

  const rootClass = layout === "sidebar" ? styles.sidebar : styles.overlay;

  return (
    <section className={rootClass} role="region" aria-label="Player selection">
      {(showClose || layout === "overlay") && onClose ? (
        <header className={styles.header}>
          <h3 className={styles.title}>Player Selection</h3>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label={t("squadSelection.closePlayerPicker")}
            onClick={onClose}
          >
            <IconClose />
          </button>
        </header>
      ) : (
        <h3 className={styles.titleStatic}>Player Selection</h3>
      )}

      <SquadPlayerSearch value={searchQuery} onChange={onSearchQueryChange} />

      <SquadPlayerFilters
        positionFilter={positionFilter}
        teamCodeFilter={teamCodeFilter}
        onPositionFilterChange={onPositionFilterChange}
        onTeamCodeFilterChange={onTeamCodeFilterChange}
      />

      <p className={styles.subtitle}>
        {t("squadSelection.playersShown", { count: formatInteger(players.length) })}
      </p>

      <div className={styles.rows} role="list">
        {players.map((player) => {
          const disabled = isPlayerDisabled?.(player) ?? false;
          return (
            <article key={player.id} className={styles.row} role="listitem">
              <span className={styles.numberTag} aria-label={`Squad number ${player.squadNumber}`}>
                {player.squadNumber > 0 ? player.squadNumber : "-"}
              </span>

              <PlayerCardTrigger player={player} className={styles.flagBtn}>
                <img
                  className={styles.flag}
                  src={getFlagUrl(player.countryIso2)}
                  alt={`${player.countryName} flag`}
                  width={30}
                  height={22}
                  loading="lazy"
                />
              </PlayerCardTrigger>

              <PlayerCardTrigger player={player} className={styles.playerMeta}>
                <p className={styles.playerLastName}>{player.lastName}</p>
                <p className={styles.playerSubline}>
                  {player.teamCode} {player.position}
                </p>
              </PlayerCardTrigger>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label={t("playerCard.moreInfo", { player: player.lastName })}
                  onClick={() => openPlayer(player)}
                >
                  ?
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label={`Add ${player.lastName}`}
                  disabled={disabled}
                  onClick={() => onAddPlayer(player)}
                >
                  <IconPlus width={16} height={16} strokeWidth={2.2} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
