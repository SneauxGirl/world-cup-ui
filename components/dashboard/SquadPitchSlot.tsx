import { IconPeople, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { SquadPitchSlot as SquadPitchSlotData } from "@/data/squad-pitch-formation";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPitchSlot.module.scss";

type Props = {
  slot: SquadPitchSlotData;
  onSelect?: (slot: SquadPitchSlotData) => void;
  selectedPlayer?: SquadPlayerPoolEntry;
};

export function SquadPitchSlot({ slot, onSelect, selectedPlayer }: Props) {
  const top = `${slot.top}%`;
  const isFilled = Boolean(selectedPlayer);

  return (
    <button
      type="button"
      className={styles.slot}
      style={{ top, left: `${slot.left}%` }}
      aria-label={
        isFilled
          ? `${selectedPlayer?.lastName} selected in ${slot.position}`
          : t("squadSelection.addPlayerSlot", { position: slot.position })
      }
      onClick={() => onSelect?.(slot)}
    >
      <span className={styles.slotInner}>
        <span className={isFilled ? styles.slotSurfaceFilled : styles.slotSurface}>
          <span className={styles.slotIconRow} aria-hidden="true">
            <span className={styles.slotPlus}>
              <IconPlus width={14} height={14} strokeWidth={3.5} />
            </span>
            <IconPeople className={styles.slotPerson} width={34} height={34} />
          </span>
          {isFilled ? (
            <>
              <span className={styles.slotPlayerName}>{selectedPlayer?.lastName}</span>
              <span className={styles.slotPlayerMeta}>
                {selectedPlayer?.countryCode} {slot.position}
              </span>
            </>
          ) : (
            <span className={styles.slotPosition}>{slot.position}</span>
          )}
        </span>
      </span>
    </button>
  );
}
