"use client";

import Image from "next/image";
import { PlayerCardTrigger } from "@/components/dashboard/player-card/PlayerCardTrigger";
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
            <PlayerCardTrigger
              player={selectedPlayer}
              className={styles.slotTopMeta}
              stopPropagation
            >
              <span className={styles.slotPlayerPoints}>{selectedPlayer.fantasyPoints}</span>
              <span className={styles.slotPlayerMeta}>{slot.position}</span>
            </PlayerCardTrigger>
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
            <PlayerCardTrigger
              player={selectedPlayer}
              className={styles.slotPlayerImageBtn}
              stopPropagation
            >
              <span className={styles.slotPlayerImageWrap} aria-hidden="true">
                <Image
                  src={jerseySrc}
                  alt=""
                  fill
                  className={styles.slotPlayerImage}
                  sizes="(min-width: 901px) 7.25rem, 5.78rem"
                />
              </span>
            </PlayerCardTrigger>
            <PlayerCardTrigger
              player={selectedPlayer}
              className={styles.slotPlayerName}
              stopPropagation
            >
              {selectedPlayer.lastName}
            </PlayerCardTrigger>
          </>
        ) : null}
      </span>
    </div>
  );
}
