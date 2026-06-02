"use client";

import type { MouseEvent, ReactNode } from "react";
import { usePlayerCard, type PlayerCardRef } from "@/lib/player-card/PlayerCardProvider";
import { t } from "@/lib/i18n/t";
import styles from "./PlayerCardTrigger.module.scss";

type Props = {
  player: PlayerCardRef;
  children: ReactNode;
  className?: string;
  /** When true, does not bubble the click (e.g. inside another button). */
  stopPropagation?: boolean;
  disabled?: boolean;
};

function getPlayerLabel(player: PlayerCardRef): string {
  if (typeof player === "string") return player;
  if ("lastName" in player && player.lastName) return player.lastName;
  return player.id;
}

export function PlayerCardTrigger({
  player,
  children,
  className,
  stopPropagation = false,
  disabled = false,
}: Props) {
  const { openPlayer } = usePlayerCard();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    openPlayer(player);
  };

  return (
    <button
      type="button"
      className={[styles.trigger, className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={t("playerCard.open", { player: getPlayerLabel(player) })}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
