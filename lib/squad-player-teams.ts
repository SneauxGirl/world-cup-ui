import { squadPlayerPool } from "@/data/squad-player-pool";

export type SquadPlayerTeamOption = {
  teamCode: string;
  countryName: string;
  countryIso2: string;
};

export function getSquadPlayerTeams(): SquadPlayerTeamOption[] {
  const byCode = new Map<string, SquadPlayerTeamOption>();

  for (const player of squadPlayerPool) {
    if (!byCode.has(player.teamCode)) {
      byCode.set(player.teamCode, {
        teamCode: player.teamCode,
        countryName: player.countryName,
        countryIso2: player.countryIso2,
      });
    }
  }

  return [...byCode.values()].sort((a, b) => a.countryName.localeCompare(b.countryName));
}
