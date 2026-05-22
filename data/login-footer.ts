/** Partner brands for the login page sponsor strip. Optional logo per cell. */
export const loginFooterPartners = [
  {
    id: "brendan-hugo",
    name: "",
    role: "leadPartner" as const,
    logo: "/partners/brendan-hugo.png",
    logoWidth: 1024,
    logoHeight: 307,
  },
  {
    id: "michigan-humane",
    name: "",
    role: "officialPets" as const,
    logo: "/partners/michigan-humane-society.png",
    logoWidth: 1024,
    logoHeight: 307,
  },
  {
    id: "bank-of-stockton",
    name: "",
    role: "officialBank" as const,
    logo: "/partners/bank-of-stockton.png",
    logoWidth: 1024,
    logoHeight: 307,
  },
  {
    id: "fantasy-cola",
    name: "",
    role: "officialSoftDrink" as const,
    logo: "/partners/fantasy-cola.png",
    logoWidth: 1024,
    logoHeight: 307,
  },
  {
    id: "adidas",
    name: "",
    role: "officialBall" as const,
    logo: "/partners/adidas.png",
    logoWidth: 1024,
    logoHeight: 307,
  },
] as const;

/** Three columns; row 1 then row 2 in each column (full-height dividers between columns). */
export const loginFooterNavColumns = [
  ["worldCup", "matches"] as const,
  ["latestNews", "teams"] as const,
  ["standings", "players"] as const,
] as const;

export const loginFooterLegalLinks = [
  "terms",
  "policies",
  "cookies",
  "contact",
] as const;
