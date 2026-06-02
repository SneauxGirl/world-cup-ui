"use client";

import Image from "next/image";
import { PlayerCardTrigger } from "@/components/dashboard/player-card/PlayerCardTrigger";
import { IconClose, IconPlus } from "@/components/icons/DashboardIcons";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import {
  squadPitchFormation,
  type SquadPitchSlot,
} from "@/data/squad-pitch-formation";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import styles from "./SquadSelectionListView.module.scss";

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
      <ul className={styles.rows}>
        {squadPitchFormation.map((slot) => {
          const player = rosterBySlot[slot.id];
          return (
            <li key={slot.id}>
              {player ? (
                <FilledRosterRow
                  slot={slot}
                  player={player}
                  onSlotSelect={onSlotSelect}
                  onSlotClear={onSlotClear}
                />
              ) : (
                <EmptyRosterRow slot={slot} onSlotSelect={onSlotSelect} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyRosterRow({
  slot,
  onSlotSelect,
}: {
  slot: SquadPitchSlot;
  onSlotSelect: (slot: SquadPitchSlot) => void;
}) {
  return (
    <article className={styles.row}>
      <span className={styles.positionTag}>{slot.position}</span>
      <button
        type="button"
        className={styles.emptySlotBtn}
        onClick={() => onSlotSelect(slot)}
      >
        <span className={styles.emptySlotIcon} aria-hidden="true">
          <IconPlus width={14} height={14} strokeWidth={3} />
        </span>
        <span className={styles.emptySlotLabel}>
          {t("squadSelection.listEmptySlot", { position: slot.position })}
        </span>
      </button>
    </article>
  );
}

function FilledRosterRow({
  slot,
  player,
  onSlotSelect,
  onSlotClear,
}: {
  slot: SquadPitchSlot;
  player: SquadPlayerPoolEntry;
  onSlotSelect: (slot: SquadPitchSlot) => void;
  onSlotClear: (slot: SquadPitchSlot) => void;
}) {
  const jerseySrc = getTeamJerseyPath(player.teamCode);

  return (
    <article className={styles.row}>
      <span className={styles.positionTag}>{slot.position}</span>

      <PlayerCardTrigger player={player} className={styles.avatarBtn}>
        <span className={styles.avatar} aria-hidden="true">
          <Image
            src={jerseySrc}
            alt=""
            width={36}
            height={36}
            className={styles.avatarImg}
          />
        </span>
      </PlayerCardTrigger>

      <PlayerCardTrigger player={player} className={styles.playerMeta}>
        <p className={styles.playerLastName}>{player.lastName}</p>
        <p className={styles.playerSubline}>
          {player.teamCode}
          <span aria-hidden="true"> · </span>
          {t("player.points", { pts: formatInteger(player.fantasyPoints) })}
        </p>
      </PlayerCardTrigger>

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
