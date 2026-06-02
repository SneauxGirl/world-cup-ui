import type { SquadPositionCode } from "@/data/squad-pitch-formation";
import type {
  ValueTrendCandle,
  ValueTrendKeyStat,
  ValueTrendStatKey,
  ValueTrendTemplate,
} from "@/data/types";
import type { PlayerFantasyProfile } from "@/lib/player-fantasy/types";
import { getPlayerProfile } from "@/lib/player-fantasy/profiles";
import { minutesToPlotPoints, sumMinutesPlotPoints } from "@/lib/value-trends/compute";

const TREND_GAME_START = 5;
const WINDOW_SIZE = 5;

function gameTotal(game: { minutes: number; fantasyPoints: number }): number {
  return game.fantasyPoints;
}

function matchPointsOnly(game: { minutes: number; fantasyPoints: number }): number {
  return Math.max(0, game.fantasyPoints - minutesToPlotPoints(game.minutes));
}

function buildRollingCandles(games: PlayerFantasyProfile["games"]): ValueTrendCandle[] {
  const totals = games.map(gameTotal);
  const minutes = games.map((game) => game.minutes);
  const windowCount = Math.max(games.length - WINDOW_SIZE + 1, 0);
  const candles: ValueTrendCandle[] = [];

  for (let index = 0; index < windowCount; index += 1) {
    const windowTotals = totals.slice(index, index + WINDOW_SIZE);
    const windowMinutes = minutes.slice(index, index + WINDOW_SIZE);
    const appearanceTotal = sumMinutesPlotPoints(windowMinutes);

    candles.push({
      windowIndex: index,
      gameStart: index + 1,
      gameEnd: index + WINDOW_SIZE,
      open: windowTotals[0],
      close: windowTotals[windowTotals.length - 1],
      high: Math.max(...windowTotals),
      low: Math.min(...windowTotals),
      minutesPlayed: windowMinutes.reduce((sum, value) => sum + value, 0),
      minutesPlotPoints: appearanceTotal,
      minutesBarPlotPoints: appearanceTotal / WINDOW_SIZE,
      windowAverage:
        Math.round(
          (windowTotals.reduce((sum, value) => sum + value, 0) / WINDOW_SIZE) * 10,
        ) / 10,
    });
  }

  return candles;
}

function statsForPosition(
  position: SquadPositionCode,
  values: Record<ValueTrendStatKey, number>,
): ValueTrendKeyStat[] {
  const maxByKey: Record<ValueTrendStatKey, number> = {
    goalThreat: 100,
    form: 100,
    matchup: 100,
    minutes: 100,
    saves: 100,
    cleanSheets: 100,
  };

  const keysByPosition: Record<SquadPositionCode, ValueTrendStatKey[]> = {
    GKP: ["saves", "cleanSheets", "minutes", "form"],
    DEF: ["cleanSheets", "goalThreat", "minutes", "form"],
    MID: ["goalThreat", "form", "matchup", "minutes"],
    FWD: ["goalThreat", "form", "matchup", "minutes"],
  };

  return keysByPosition[position].map((labelKey) => ({
    labelKey,
    value: values[labelKey],
    max: maxByKey[labelKey],
  }));
}

function clampStat(value: number, max = 100): number {
  return Math.min(max, Math.max(0, Math.round(value)));
}

function deriveKeyStatValues(
  position: SquadPositionCode,
  profile: PlayerFantasyProfile,
): Record<ValueTrendStatKey, number> {
  const { season } = profile;
  const trendGames = profile.games.slice(TREND_GAME_START);
  const avgTrendTotal =
    trendGames.reduce((sum, game) => sum + gameTotal(game), 0) /
    Math.max(trendGames.length, 1);
  const avgMinutes =
    trendGames.reduce((sum, game) => sum + game.minutes, 0) /
    Math.max(trendGames.length, 1);

  const form = clampStat(avgTrendTotal * 5);
  const minutes = clampStat((avgMinutes / 90) * 100);
  const goalThreat = clampStat(season.g * 14 + season.a * 8 + season.s * 1.5);
  const matchup = clampStat(form * 0.85 + goalThreat * 0.15);

  if (position === "GKP") {
    const saves = clampStat(season.s * 3 + season.sog * 4);
    const cleanSheets = clampStat(season.g === 0 ? avgTrendTotal * 4 : season.g * 20);
    return { goalThreat, form, matchup, minutes, saves, cleanSheets };
  }

  const cleanSheets = clampStat(position === "DEF" ? season.g * 18 + form * 0.35 : 0);

  return { goalThreat, form, matchup, minutes, saves: 0, cleanSheets };
}

function deriveExpectedPoints(trendGames: PlayerFantasyProfile["games"]): number {
  if (trendGames.length === 0) return 0;
  const totals = trendGames.map(gameTotal);
  const recent = totals.slice(-3);
  const recentAvg = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  const overallAvg = totals.reduce((sum, value) => sum + value, 0) / totals.length;
  return Math.round((recentAvg * 0.6 + overallAvg * 0.4) * 10) / 10;
}

export function buildValueTrendTemplate(
  profile: PlayerFantasyProfile,
  position: SquadPositionCode,
): ValueTrendTemplate {
  const trendGames = profile.games.slice(TREND_GAME_START);
  const candles = buildRollingCandles(profile.games);
  const trendTotals = trendGames.map(gameTotal);
  const rollingAverage =
    trendTotals.length > 0
      ? Math.round(
          (trendTotals.reduce((sum, value) => sum + value, 0) / trendTotals.length) * 10,
        ) / 10
      : 0;

  const insightLines = profile.narrative
    ? profile.narrative
        .split(/(?<=[.!?])\s+/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  return {
    rollingAverage,
    candles,
    lastFiveMatchPoints: trendGames.map(matchPointsOnly),
    lastFiveMatchMinutes: trendGames.map((game) => game.minutes),
    keyStats: statsForPosition(position, deriveKeyStatValues(position, profile)),
    expectedPoints: deriveExpectedPoints(trendGames),
    insightLines,
  };
}

export function getTemplateForPlayer(
  playerId: string,
  position: SquadPositionCode,
): ValueTrendTemplate | undefined {
  const profile = getPlayerProfile(playerId);
  if (!profile) return undefined;
  return buildValueTrendTemplate(profile, position);
}
