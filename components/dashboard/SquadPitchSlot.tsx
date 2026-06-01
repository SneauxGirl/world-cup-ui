import Image from "next/image";
import { IconClose, IconPeople, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { SquadPitchSlot as SquadPitchSlotData } from "@/data/squad-pitch-formation";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPitchSlot.module.scss";

type Props = {
  slot: SquadPitchSlotData;
  onSelect?: (slot: SquadPitchSlotData) => void;
  onClear?: (slot: SquadPitchSlotData) => void;
  selectedPlayer?: SquadPlayerPoolEntry;
};

export function SquadPitchSlot({ slot, onSelect, onClear, selectedPlayer }: Props) {
  const top = `${slot.top}%`;
  const isFilled = Boolean(selectedPlayer);
  const jerseySrc = selectedPlayer ? getTeamJerseyPath(selectedPlayer.teamCode) : null;

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
          {isFilled && jerseySrc ? (
            <>
              <button
                type="button"
                className={styles.slotClearBtn}
                aria-label={t("squadSelection.removePlayerFromSlot", {
                  player: selectedPlayer?.lastName ?? slot.position,
                })}
                onClick={(event) => {
                  event.stopPropagation();
                  onClear?.(slot);
                }}
              >
                <IconClose width={12} height={12} />
              </button>
              <span className={styles.slotTopMeta}>
                <span className={styles.slotPlayerPoints}>
                  {selectedPlayer?.fantasyPoints ?? 0} pts
                </span>
                <span className={styles.slotPlayerMeta}>{slot.position}</span>
              </span>
              <span className={styles.slotPlayerImageWrap} aria-hidden="true">
                <Image
                  src={jerseySrc}
                  alt=""
                  fill
                  className={styles.slotPlayerImage}
                  sizes="90px"
                />
              </span>
              <span className={styles.slotPlayerName}>{selectedPlayer?.lastName}</span>
            </>
          ) : (
            <span className={styles.slotPosition}>{slot.position}</span>
          )}
        </span>
      </span>
    </button>
  );
}
