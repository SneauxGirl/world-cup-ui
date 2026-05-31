import type { UserRosterMap } from "@/data/types";
import { DEFAULT_ROSTER_BY_SLOT } from "@/data/default-roster";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import { squadPlayerPool } from "@/data/squad-player-pool";

export const ROSTER_STORAGE_KEY = "wcui-user-roster-v1";

export function loadRosterFromLocal(): UserRosterMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ROSTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as UserRosterMap;
  } catch {
    return null;
  }
}

export function saveRosterToLocal(roster: UserRosterMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
}

export async function loadRosterFromFirestore(uid: string): Promise<UserRosterMap | null> {
  try {
    const snapshot = await getDoc(doc(getFirebaseDb(), "users", uid));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    const roster = data?.roster;
    if (!roster || typeof roster !== "object") return null;
    return roster as UserRosterMap;
  } catch {
    return null;
  }
}

export async function saveRosterToFirestore(
  uid: string,
  roster: UserRosterMap,
): Promise<boolean> {
  try {
    await setDoc(
      doc(getFirebaseDb(), "users", uid),
      { roster },
      { merge: true },
    );
    return true;
  } catch {
    return false;
  }
}

const playerById = new Map(squadPlayerPool.map((player) => [player.id, player]));

export function hydrateRoster(
  rosterMap: UserRosterMap,
): Record<string, SquadPlayerPoolEntry> {
  const hydrated: Record<string, SquadPlayerPoolEntry> = {};
  for (const [slotId, playerId] of Object.entries(rosterMap)) {
    const player = playerById.get(playerId);
    if (player) hydrated[slotId] = player;
  }
  return hydrated;
}

export function dehydrateRoster(
  rosterBySlot: Record<string, SquadPlayerPoolEntry>,
): UserRosterMap {
  return Object.fromEntries(
    Object.entries(rosterBySlot).map(([slotId, player]) => [slotId, player.id]),
  );
}

export function findPlayerById(playerId: string): SquadPlayerPoolEntry | undefined {
  return playerById.get(playerId);
}

export function hydrateDefaultRoster(): Record<string, SquadPlayerPoolEntry> {
  return hydrateRoster(DEFAULT_ROSTER_BY_SLOT);
}

export function getDefaultRosterMap(): UserRosterMap {
  return { ...DEFAULT_ROSTER_BY_SLOT };
}
