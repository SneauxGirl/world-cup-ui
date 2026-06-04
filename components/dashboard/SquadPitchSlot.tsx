"use client";

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
  const selectLabel = isFilled
    ? `${selectedPlayer?.lastName} selected in ${slot.position}`
    : t("squadSelection.addPlayerSlot", { position: slot.position });

  return (
    <div className={styles.slot} style={{ top, left: `${slot.left}%` }}>
      <span className={styles.slotInner}>
        <button
          type="button"
          className={styles.slotSelect}
          aria-label={selectLabel}
          onClick={() => onSelect?.(slot)}
        >
          <span className={isFilled ? styles.slotSurfaceFilled : styles.slotSurface}>
            {!isFilled ? (
              <>
                <span className={styles.slotIconRow} aria-hidden="true">
                  <span className={styles.slotPlus}>
                    <IconPlus width={14} height={14} strokeWidth={3.5} />
                  </span>
                  <IconPeople className={styles.slotPerson} width={34} height={34} />
                </span>
                <span className={styles.slotPosition}>{slot.position}</span>
              </>
            ) : null}
          </span>
        </button>

        {isFilled && jerseySrc && selectedPlayer ? (
          <>
            <div className={styles.slotTopMeta}>
              <span className={styles.slotPlayerPoints}>{selectedPlayer.fantasyPoints}</span>
              <span className={styles.slotPlayerMeta}>{slot.position}</span>
            </div>
            <button
              type="button"
              className={styles.slotClearBtn}
              aria-label={t("squadSelection.removePlayerFromSlot", {
                player: selectedPlayer.lastName,
              })}
              onClick={() => onClear?.(slot)}
            >
              <IconClose width={12} height={12} />
            </button>
            <div className={styles.slotPlayerImageBtn} aria-hidden="true">
              <span className={styles.slotPlayerImageWrap}>
                <Image
                  src={jerseySrc}
                  alt=""
                  fill
                  className={styles.slotPlayerImage}
                  sizes="(min-width: 901px) 7.25rem, 5.78rem"
                />
              </span>
            </div>
            <div className={styles.slotPlayerName}>{selectedPlayer.lastName}</div>
          </>
        ) : null}
      </span>
    </div>
  );
}
