import { IconPeople, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPitchSlot as SquadPitchSlotData } from "@/data/squad-pitch-formation";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPitchSlot.module.scss";

type Props = {
  slot: SquadPitchSlotData;
};

export function SquadPitchSlot({ slot }: Props) {
  const top = typeof slot.top === "number" ? `${slot.top}%` : slot.top;

  return (
    <button
      type="button"
      className={styles.slot}
      style={{ top, left: `${slot.left}%` }}
      aria-label={t("squadSelection.addPlayerSlot", { position: slot.position })}
    >
      <span className={styles.slotInner}>
        <span className={styles.slotSurface}>
          <span className={styles.slotIconRow} aria-hidden="true">
            <span className={styles.slotPlus}>
              <IconPlus width={14} height={14} strokeWidth={3.5} />
            </span>
            <IconPeople className={styles.slotPerson} width={34} height={34} />
          </span>
          <span className={styles.slotPosition}>{slot.position}</span>
        </span>
      </span>
    </button>
  );
}
