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
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import {
  dehydrateRoster,
  hydrateRoster,
  loadRosterFromFirestore,
  loadRosterFromLocal,
  saveRosterToFirestore,
  saveRosterToLocal,
} from "@/lib/roster/storage";

type RosterContextValue = {
  rosterBySlot: Record<string, SquadPlayerPoolEntry>;
  rosterCount: number;
  isDemoMode: boolean;
  loading: boolean;
  setPlayerForSlot: (slotId: string, player: SquadPlayerPoolEntry) => void;
  removePlayerFromSlot: (slotId: string) => void;
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

      if (user) {
        rosterMap = await loadRosterFromFirestore(user.uid);
      }

      if (!rosterMap) {
        rosterMap = loadRosterFromLocal();
      }

      if (!cancelled) {
        setRosterBySlot(rosterMap ? hydrateRoster(rosterMap) : {});
        setLoading(false);
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

  const value = useMemo(
    () => ({
      rosterBySlot,
      rosterCount,
      isDemoMode,
      loading: loading || authLoading,
      setPlayerForSlot,
      removePlayerFromSlot,
    }),
    [
      rosterBySlot,
      rosterCount,
      isDemoMode,
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
