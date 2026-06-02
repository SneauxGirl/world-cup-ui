"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PlayerCardModal } from "@/components/shared/PlayerCardModal";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import type { ValueTrendTemplate } from "@/data/types";
import { getTemplateForPlayer } from "@/lib/player-fantasy/buildTemplate";
import { findPlayerById } from "@/lib/roster/storage";

export type PlayerCardRef = SquadPlayerPoolEntry | string | { id: string };

export type PlayerCardState = {
  player?: SquadPlayerPoolEntry;
  template?: ValueTrendTemplate;
  slotLabel?: string;
};

export type PlayerCardOpenOptions = {
  template?: ValueTrendTemplate;
  slotLabel?: string;
};

type PlayerCardContextValue = {
  openPlayer: (player: PlayerCardRef, options?: PlayerCardOpenOptions) => void;
  openPlayerCard: (state: PlayerCardState) => void;
  closePlayer: () => void;
};

const PlayerCardContext = createContext<PlayerCardContextValue | null>(null);

function resolvePlayer(ref: PlayerCardRef): SquadPlayerPoolEntry | undefined {
  if (typeof ref === "string") {
    return findPlayerById(ref);
  }
  if ("lastName" in ref) {
    return ref;
  }
  return findPlayerById(ref.id);
}

export function PlayerCardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerCardState | null>(null);

  const openPlayerCard = useCallback((next: PlayerCardState) => {
    if (next.player ?? next.template) {
      setState(next);
    }
  }, []);

  const openPlayer = useCallback(
    (ref: PlayerCardRef, options?: PlayerCardOpenOptions) => {
      const player = resolvePlayer(ref);
      if (!player) return;
      setState({
        player,
        template:
          options?.template ?? getTemplateForPlayer(player.id, player.position),
        slotLabel: options?.slotLabel,
      });
    },
    [],
  );

  const closePlayer = useCallback(() => setState(null), []);

  const value = useMemo(
    () => ({ openPlayer, openPlayerCard, closePlayer }),
    [openPlayer, openPlayerCard, closePlayer],
  );

  return (
    <PlayerCardContext.Provider value={value}>
      {children}
      <PlayerCardModal state={state} onClose={closePlayer} />
    </PlayerCardContext.Provider>
  );
}

export function usePlayerCard() {
  const context = useContext(PlayerCardContext);
  if (!context) {
    throw new Error("usePlayerCard must be used inside PlayerCardProvider");
  }
  return context;
}
