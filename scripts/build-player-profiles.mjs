/**
 * Builds data/player-fantasy-profiles.json from the filled fantasy CSV
 * keyed by squad pool player id (wc2026-squads-formatted.json is identity source).
 *
 * Run: node scripts/build-player-profiles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const CSV_PATH = path.join(root, "data/fantasy_dummy_data_expanded_filled.csv");
const SQUAD_PATH = path.join(root, "data/wc2026-squads-formatted.json");
const OUT_PATH = path.join(root, "data/player-fantasy-profiles.json");

/** CSV uses reversed Korean order; JSON naming is canonical. */
const KOREAN_NAME_ALIASES = {
  "kim min-jae": { firstName: "Min-jae", lastName: "Kim" },
  "son heung-min": { firstName: "Heung-min", lastName: "Son" },
};

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function makeSquadPlayerId(entry) {
  const label = `${entry.firstName} ${entry.lastName}`.trim();
  return `${entry.nation}-${entry.position}-${label}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function resolvePoolKey(country, playerName) {
  const nationKey = normalize(country);
  const nameKey = normalize(playerName);
  const alias = KOREAN_NAME_ALIASES[nameKey];
  if (alias) {
    return `${nationKey}|${normalize(`${alias.firstName} ${alias.lastName}`)}`;
  }
  return `${nationKey}|${nameKey}`;
}

function toNumber(value) {
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildProfile(row) {
  const games = [];
  for (let game = 1; game <= 10; game += 1) {
    const minutesIndex = 18 + (game - 1) * 2;
    const pointsIndex = minutesIndex + 1;
    games.push({
      minutes: toNumber(row[minutesIndex]),
      fantasyPoints: toNumber(row[pointsIndex]),
    });
  }

  const gpFromGames = games.filter((game) => game.minutes > 0).length;
  const gsFromGames = games.filter((game) => game.minutes >= 45).length;
  const mpFromGames = games.reduce((sum, game) => sum + game.minutes, 0);

  return {
    games,
    season: {
      gp: gpFromGames,
      gs: gsFromGames,
      mp: mpFromGames,
      g: toNumber(row[6]),
      hg: toNumber(row[7]),
      pkg: toNumber(row[8]),
      a: toNumber(row[9]),
      s: toNumber(row[10]),
      sog: toNumber(row[11]),
      soff: toNumber(row[12]),
      off: toNumber(row[13]),
      ck: toNumber(row[14]),
      yc: toNumber(row[15]),
      rc: toNumber(row[16]),
      yrc: toNumber(row[17]),
    },
    narrative: row[38]?.trim() ?? "",
    totalFantasyPoints: games.reduce((sum, game) => sum + game.fantasyPoints, 0),
  };
}

function main() {
  const squad = JSON.parse(fs.readFileSync(SQUAD_PATH, "utf8"));
  const poolByKey = new Map();

  for (const entry of squad) {
    const id = makeSquadPlayerId(entry);
    const key = `${normalize(entry.nation)}|${normalize(`${entry.firstName} ${entry.lastName}`)}`;
    poolByKey.set(key, id);
  }

  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const [header, ...dataRows] = parseCsv(csvText);
  if (!header) {
    throw new Error("CSV header missing");
  }

  const profiles = {};
  const unmatched = [];

  for (const row of dataRows) {
    const playerName = row[0]?.trim();
    const country = row[1]?.trim();
    if (!playerName || !country) continue;

    const key = resolvePoolKey(country, playerName);
    const playerId = poolByKey.get(key);
    if (!playerId) {
      unmatched.push(`${playerName} (${country})`);
      continue;
    }

    profiles[playerId] = buildProfile(row);
  }

  if (unmatched.length > 0) {
    console.error("Unmatched CSV rows:", unmatched.join(", "));
    process.exit(1);
  }

  if (Object.keys(profiles).length !== squad.length) {
    console.error(
      `Expected ${squad.length} profiles, got ${Object.keys(profiles).length}`,
    );
    process.exit(1);
  }

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(profiles, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(profiles).length} profiles to ${OUT_PATH}`);
}

main();
