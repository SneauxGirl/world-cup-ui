"use client";

import { CountryFlag } from "@/components/CountryFlag";
import { IconClose, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import {
  squadPitchFormation,
  type SquadPitchSlot,
  type SquadPositionCode,
} from "@/data/squad-pitch-formation";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./SquadSelectionListView.module.scss";

const POSITION_ORDER: SquadPositionCode[] = ["GKP", "DEF", "MID", "FWD"];

const slotsByPosition = POSITION_ORDER.map((position) => ({
  position,
  slots: squadPitchFormation.filter((slot) => slot.position === position),
}));

type Props = {
  rosterBySlot: Record<string, SquadPlayerPoolEntry>;
  onSlotSelect: (slot: SquadPitchSlot) => void;
  onSlotClear: (slot: SquadPitchSlot) => void;
  className?: string;
};

export function SquadSelectionListView({
  rosterBySlot,
  onSlotSelect,
  onSlotClear,
  className,
}: Props) {
  return (
    <div
      className={[styles.list, className].filter(Boolean).join(" ")}
      role="region"
      aria-label={t("squadSelection.listLabel")}
    >
      <div className={styles.sections}>
        {slotsByPosition.map(({ position, slots }) => {
          const sectionId = `roster-position-${position}`;
          return (
            <section
              key={position}
              className={styles.section}
              aria-labelledby={sectionId}
            >
              <h3 id={sectionId} className={styles.sectionTitle}>
                {t(`squadSelection.positionGroup.${position}`)}
              </h3>
              <ul className={styles.rows}>
                {slots.map((slot, index) => {
                  const player = rosterBySlot[slot.id];
                  const slotNumber = index + 1;
                  return (
                    <li key={slot.id}>
                      {player ? (
                        <FilledRosterRow
                          slot={slot}
                          slotNumber={slotNumber}
                          player={player}
                          onSlotSelect={onSlotSelect}
                          onSlotClear={onSlotClear}
                        />
                      ) : (
                        <EmptyRosterRow
                          slot={slot}
                          slotNumber={slotNumber}
                          onSlotSelect={onSlotSelect}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function EmptyRosterRow({
  slot,
  slotNumber,
  onSlotSelect,
}: {
  slot: SquadPitchSlot;
  slotNumber: number;
  onSlotSelect: (slot: SquadPitchSlot) => void;
}) {
  return (
    <article className={styles.row}>
      <span className={styles.numberTag} aria-hidden="true">
        {slotNumber}.
      </span>
      <button
        type="button"
        className={styles.emptySlotBtn}
        aria-label={t("squadSelection.listEmptySlot", { position: slot.position })}
        onClick={() => onSlotSelect(slot)}
      >
        <IconPlus width={16} height={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </article>
  );
}

function FilledRosterRow({
  slot,
  slotNumber,
  player,
  onSlotSelect,
  onSlotClear,
}: {
  slot: SquadPitchSlot;
  slotNumber: number;
  player: SquadPlayerPoolEntry;
  onSlotSelect: (slot: SquadPitchSlot) => void;
  onSlotClear: (slot: SquadPitchSlot) => void;
}) {
  return (
    <article className={styles.row}>
      <span className={styles.numberTag} aria-hidden="true">
        {slotNumber}.
      </span>

      <span className={styles.flagBtn}>
        <CountryFlag
          code={player.teamCode}
          label={player.countryName}
          className={styles.flag}
        />
      </span>

      <div className={styles.playerMeta}>
        <p className={styles.playerLastName}>{player.lastName}</p>
        <p className={styles.playerSubline}>
          {player.countryName}
          <span aria-hidden="true"> · </span>
          {t("player.points", { pts: formatInteger(player.fantasyPoints) })}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t("squadSelection.listChangePlayer", {
            player: player.lastName,
            position: slot.position,
          })}
          onClick={() => onSlotSelect(slot)}
        >
          <IconPlus width={16} height={16} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t("squadSelection.removePlayerFromSlot", {
            player: player.lastName,
          })}
          onClick={() => onSlotClear(slot)}
        >
          <IconClose width={14} height={14} />
        </button>
      </div>
    </article>
  );
}
