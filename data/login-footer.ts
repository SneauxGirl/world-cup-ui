/** Partner brands for the login page sponsor strip. Optional logo per cell. */
export const loginFooterPartners = [
  {
    id: "brendan-hugo",
    name: "",
    role: "leadPartner" as const,
    logo: "/partners/lead.png",
    logoWidth: 1000,
    logoHeight: 300,
  },
  {
    id: "michigan-humane",
    name: "",
    role: "officialPets" as const,
    logo: "/partners/pets.png",
    logoWidth: 1000,
    logoHeight: 300,
  },
  {
    id: "bank-of-stockton",
    name: "",
    role: "officialBank" as const,
    logo: "/partners/bank1.png",
    logoWidth: 1000,
    logoHeight: 300,
  },
  {
    id: "fantasy-cola",
    name: "",
    role: "officialSoftDrink" as const,
    logo: "/partners/drink.png",
    logoWidth: 1000,
    logoHeight: 300,
  },
  {
    id: "adidas",
    name: "",
    role: "officialBall" as const,
    logo: "/partners/ball.png",
    logoWidth: 1000,
    logoHeight: 300,
  },
] as const;

/** Three columns; row 1 then row 2 in each column (full-height dividers between columns). */
export const loginFooterNavColumns = [
  ["worldCup", "matches"] as const,
  ["latestNews", "teams"] as const,
  ["standings", "players"] as const,
] as const;

/** Row-major order for single-column footer nav (zipper merge across columns). */
export function getLoginFooterNavItemsRowMajor() {
  const rowCount = Math.max(...loginFooterNavColumns.map((column) => column.length));
  const items: string[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    for (const column of loginFooterNavColumns) {
      const item = column[row];
      if (item) items.push(item);
    }
  }

  return items;
}

export const loginFooterLegalLinks = [
  "terms",
  "policies",
  "cookies",
  "contact",
] as const;
