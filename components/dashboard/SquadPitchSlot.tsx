import { IconPeople, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPitchSlot as SquadPitchSlotData } from "@/data/squad-pitch-formation";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPitchSlot.module.scss";

type Props = {
  slot: SquadPitchSlotData;
};

export function SquadPitchSlot({ slot }: Props) {
  return (
    <button
      type="button"
      className={styles.slot}
      style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
      aria-label={t("squadSelection.addPlayerSlot", { position: slot.position })}
    >
      <span className={styles.slotInner}>
        <span className={styles.slotIconRow} aria-hidden="true">
          <span className={styles.slotPlus}>
            <IconPlus width={11} height={11} strokeWidth={2} />
          </span>
          <IconPeople className={styles.slotPerson} width={26} height={26} />
        </span>
        <span className={styles.slotPosition}>{slot.position}</span>
      </span>
    </button>
  );
}
