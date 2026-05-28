import { IconClose, IconPlus } from "@/components/icons/DashboardIcons";
import { squadPlayerPool, type SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import styles from "./PositionPlayerPicker.module.scss";

type Props = {
  position: SquadPositionCode;
  onClose: () => void;
  onAddPlayer: (player: SquadPlayerPoolEntry) => void;
};

function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

function sortByCountry(a: SquadPlayerPoolEntry, b: SquadPlayerPoolEntry): number {
  return a.countryName.localeCompare(b.countryName) || a.lastName.localeCompare(b.lastName);
}

export function PositionPlayerPicker({ position, onClose, onAddPlayer }: Props) {
  const players = squadPlayerPool.filter((player) => player.position === position).sort(sortByCountry);

  return (
    <section className={styles.overlay} role="dialog" aria-modal="false" aria-label={`${position} players`}>
      <header className={styles.header}>
        <h3 className={styles.title}>Player Selection</h3>
        <button type="button" className={styles.closeBtn} aria-label="Close player picker" onClick={onClose}>
          <IconClose />
        </button>
      </header>

      <p className={styles.subtitle}>{position} players, sorted by country</p>

      <div className={styles.rows} role="list">
        {players.map((player) => (
          <article key={player.id} className={styles.row} role="listitem">
            <span className={styles.numberTag} aria-label={`Squad number ${player.squadNumber}`}>
              {player.squadNumber}
            </span>

            <img
              className={styles.flag}
              src={getFlagUrl(player.countryCode)}
              alt={`${player.countryName} flag`}
              width={30}
              height={22}
              loading="lazy"
            />

            <div className={styles.playerMeta}>
              <p className={styles.playerLastName}>{player.lastName}</p>
              <p className={styles.playerSubline}>
                {player.countryCode} {player.position}
              </p>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.iconBtn} aria-label={`More info for ${player.lastName}`}>
                ?
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={`Add ${player.lastName}`}
                onClick={() => onAddPlayer(player)}
              >
                <IconPlus width={16} height={16} strokeWidth={2.2} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
