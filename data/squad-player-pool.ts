import type { SquadPositionCode } from "@/data/squad-pitch-formation";

export type SquadPlayerPoolEntry = {
  id: string;
  squadNumber: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  countryName: string;
  position: SquadPositionCode;
};

export const squadPlayerPool: SquadPlayerPoolEntry[] = [
  { id: "gk-arg-martinez", squadNumber: 23, firstName: "Emiliano", lastName: "Martinez", countryCode: "AR", countryName: "Argentina", position: "GKP" },
  { id: "gk-bra-alisson", squadNumber: 1, firstName: "Alisson", lastName: "Becker", countryCode: "BR", countryName: "Brazil", position: "GKP" },
  { id: "gk-fra-maignan", squadNumber: 16, firstName: "Mike", lastName: "Maignan", countryCode: "FR", countryName: "France", position: "GKP" },
  { id: "gk-eng-pickford", squadNumber: 1, firstName: "Jordan", lastName: "Pickford", countryCode: "GB", countryName: "England", position: "GKP" },
  { id: "def-bra-militao", squadNumber: 3, firstName: "Eder", lastName: "Militao", countryCode: "BR", countryName: "Brazil", position: "DEF" },
  { id: "def-fra-kounde", squadNumber: 5, firstName: "Jules", lastName: "Kounde", countryCode: "FR", countryName: "France", position: "DEF" },
  { id: "def-ger-rudiger", squadNumber: 2, firstName: "Antonio", lastName: "Rudiger", countryCode: "DE", countryName: "Germany", position: "DEF" },
  { id: "def-ned-van-dijk", squadNumber: 4, firstName: "Virgil", lastName: "van Dijk", countryCode: "NL", countryName: "Netherlands", position: "DEF" },
  { id: "mid-cro-modric", squadNumber: 10, firstName: "Luka", lastName: "Modric", countryCode: "HR", countryName: "Croatia", position: "MID" },
  { id: "mid-eng-bellingham", squadNumber: 10, firstName: "Jude", lastName: "Bellingham", countryCode: "GB", countryName: "England", position: "MID" },
  { id: "mid-spa-pedri", squadNumber: 8, firstName: "Pedro", lastName: "Gonzalez", countryCode: "ES", countryName: "Spain", position: "MID" },
  { id: "mid-uru-valverde", squadNumber: 15, firstName: "Federico", lastName: "Valverde", countryCode: "UY", countryName: "Uruguay", position: "MID" },
  { id: "fwd-arg-messi", squadNumber: 10, firstName: "Lionel", lastName: "Messi", countryCode: "AR", countryName: "Argentina", position: "FWD" },
  { id: "fwd-bra-vinicius", squadNumber: 7, firstName: "Vinicius", lastName: "Junior", countryCode: "BR", countryName: "Brazil", position: "FWD" },
  { id: "fwd-fra-mbappe", squadNumber: 10, firstName: "Kylian", lastName: "Mbappe", countryCode: "FR", countryName: "France", position: "FWD" },
  { id: "fwd-nor-haaland", squadNumber: 9, firstName: "Erling", lastName: "Haaland", countryCode: "NO", countryName: "Norway", position: "FWD" },
];
