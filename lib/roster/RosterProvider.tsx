"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { isDefaultPreloadPlayer, isDefaultRosterMap } from "@/data/default-roster";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import {
  dehydrateRoster,
  getDefaultRosterMap,
  hydrateDefaultRoster,
  hydrateRoster,
  loadRosterFromFirestore,
  loadRosterFromLocal,
  saveRosterToFirestore,
  saveRosterToLocal,
} from "@/lib/roster/storage";

type RosterContextValue = {
  rosterBySlot: Record<string, SquadPlayerPoolEntry>;
  rosterCount: number;
  /** No saved roster and no default preload applied yet (should not occur once defaults load). */
  isDemoMode: boolean;
  /** Current roster matches the built-in preload squad exactly. */
  isDefaultRoster: boolean;
  loading: boolean;
  setPlayerForSlot: (slotId: string, player: SquadPlayerPoolEntry) => void;
  removePlayerFromSlot: (slotId: string) => void;
  isDefaultPreloadPlayer: (playerId: string) => boolean;
};

const RosterContext = createContext<RosterContextValue | null>(null);

export function RosterProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [rosterBySlot, setRosterBySlot] = useState<Record<string, SquadPlayerPoolEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRoster() {
      setLoading(true);

      let rosterMap = null;
      let source: "firestore" | "local" | "default" = "default";

      if (user) {
        rosterMap = await loadRosterFromFirestore(user.uid);
        if (rosterMap) source = "firestore";
      }

      if (!rosterMap) {
        rosterMap = loadRosterFromLocal();
        if (rosterMap) source = "local";
      }

      if (!rosterMap) {
        rosterMap = getDefaultRosterMap();
        source = "default";
      }

      const hydrated = rosterMap ? hydrateRoster(rosterMap) : hydrateDefaultRoster();

      if (!cancelled) {
        setRosterBySlot(hydrated);
        setLoading(false);

        if (source === "default") {
          saveRosterToLocal(rosterMap ?? getDefaultRosterMap());
          if (user) {
            void saveRosterToFirestore(user.uid, rosterMap ?? getDefaultRosterMap());
          }
        }
      }
    }

    if (!authLoading) {
      void loadRoster();
    }

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const persistRoster = useCallback(
    async (next: Record<string, SquadPlayerPoolEntry>) => {
      const map = dehydrateRoster(next);
      saveRosterToLocal(map);
      if (user) {
        await saveRosterToFirestore(user.uid, map);
      }
    },
    [user],
  );

  const setPlayerForSlot = useCallback(
    (slotId: string, player: SquadPlayerPoolEntry) => {
      setRosterBySlot((current) => {
        const next = { ...current, [slotId]: player };
        void persistRoster(next);
        return next;
      });
    },
    [persistRoster],
  );

  const removePlayerFromSlot = useCallback(
    (slotId: string) => {
      setRosterBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        void persistRoster(next);
        return next;
      });
    },
    [persistRoster],
  );

  const rosterCount = Object.keys(rosterBySlot).length;
  const isDemoMode = rosterCount === 0;
  const isDefaultRoster = isDefaultRosterMap(dehydrateRoster(rosterBySlot));

  const value = useMemo(
    () => ({
      rosterBySlot,
      rosterCount,
      isDemoMode,
      isDefaultRoster,
      loading: loading || authLoading,
      setPlayerForSlot,
      removePlayerFromSlot,
      isDefaultPreloadPlayer,
    }),
    [
      rosterBySlot,
      rosterCount,
      isDemoMode,
      isDefaultRoster,
      loading,
      authLoading,
      setPlayerForSlot,
      removePlayerFromSlot,
    ],
  );

  return <RosterContext.Provider value={value}>{children}</RosterContext.Provider>;
}

export function useRoster() {
  const context = useContext(RosterContext);
  if (!context) {
    throw new Error("useRoster must be used inside RosterProvider");
  }
  return context;
}
