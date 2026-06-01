import type {
  ValueTrendCandle,
  ValueTrendKeyStat,
  ValueTrendStatKey,
  ValueTrendTemplate,
} from "@/data/types";
import { squadPitchFormation } from "@/data/squad-pitch-formation";
import type { SquadPositionCode } from "@/data/squad-pitch-formation";

type SlotProfile = {
  baseForm: number;
  volatility: number;
  minutesBase: number;
  matchPoints: number[];
  statValues: Record<ValueTrendStatKey, number>;
  expectedPoints: number;
  insightLines: string[];
};

function buildMatchMinutes(
  minutesBase: number,
  trend: "up" | "down" | "flat" | "volatile",
): number[] {
  const avg = minutesBase / 5;
  const multipliers: Record<typeof trend, number[]> = {
    up: [0.92, 0.96, 1, 0.94, 0.98],
    down: [1, 0.9, 0.86, 0.88, 0.84],
    flat: [0.96, 0.94, 0.98, 0.95, 0.97],
    volatile: [1, 0.28, 0.95, 0.22, 0.9],
  };

  return multipliers[trend].map((mult, index) => {
    const raw = avg * mult + (index % 2) * 3;
    return Math.min(95, Math.max(1, Math.round(raw)));
  });
}

function buildCandles(
  baseForm: number,
  volatility: number,
  minutesBase: number,
  trend: "up" | "down" | "flat" | "volatile",
): ValueTrendCandle[] {
  const candles: ValueTrendCandle[] = [];
  let open = baseForm;

  for (let i = 0; i < 5; i += 1) {
    const swing = volatility * (0.6 + i * 0.08);
    let close = open;
    let high = open + swing;
    let low = open - swing * 0.65;

    if (trend === "up") {
      close = open + volatility * (0.35 + i * 0.12);
      high = close + swing * 0.45;
      low = open - swing * 0.35;
    } else if (trend === "down") {
      close = open - volatility * (0.25 + i * 0.08);
      high = open + swing * 0.35;
      low = close - swing * 0.4;
    } else if (trend === "volatile") {
      close = open + (i % 2 === 0 ? swing * 0.5 : -swing * 0.45);
      high = Math.max(open, close) + swing * 0.85;
      low = Math.min(open, close) - swing * 0.85;
    } else {
      close = open + (i - 2) * 0.4;
      high = Math.max(open, close) + swing * 0.4;
      low = Math.min(open, close) - swing * 0.4;
    }

    high = Math.max(high, open, close) + 1;
    low = Math.min(low, open, close);
    low = Math.max(2, low);

    candles.push({
      windowIndex: i,
      gameStart: i + 1,
      gameEnd: i + 5,
      open: Math.round(open * 10) / 10,
      high: Math.round(high * 10) / 10,
      low: Math.round(low * 10) / 10,
      close: Math.round(close * 10) / 10,
      minutesPlayed: Math.min(
        479,
        Math.max(86, minutesBase + i * 18 + (i % 2) * 12),
      ),
    });

    open = close;
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

function buildTemplate(
  position: SquadPositionCode,
  profile: SlotProfile,
  trend: "up" | "down" | "flat" | "volatile",
): ValueTrendTemplate {
  const candles = buildCandles(
    profile.baseForm,
    profile.volatility,
    profile.minutesBase,
    trend,
  );
  const rollingAverage =
    candles.reduce((sum, candle) => sum + candle.close, 0) / candles.length;

  return {
    rollingAverage: Math.round(rollingAverage * 10) / 10,
    candles,
    lastFiveMatchPoints: profile.matchPoints,
    lastFiveMatchMinutes: buildMatchMinutes(profile.minutesBase, trend),
    keyStats: statsForPosition(position, profile.statValues),
    expectedPoints: profile.expectedPoints,
    insightLines: profile.insightLines,
  };
}

const slotProfiles: Record<string, { trend: "up" | "down" | "flat" | "volatile"; profile: SlotProfile }> = {
  "gk-1": {
    trend: "up",
    profile: {
      baseForm: 11,
      volatility: 4,
      minutesBase: 410,
      matchPoints: [8, 12, 10, 14, 11],
      statValues: { saves: 88, cleanSheets: 72, minutes: 94, form: 86, goalThreat: 42, matchup: 78 },
      expectedPoints: 12.4,
      insightLines: [
        "Floor holding above rolling average.",
        "Save volume steady across the last five.",
        "Favorable fixture run ahead.",
      ],
    },
  },
  "gk-2": {
    trend: "volatile",
    profile: {
      baseForm: 9,
      volatility: 9,
      minutesBase: 280,
      matchPoints: [16, 4, 18, 2, 9],
      statValues: { saves: 76, cleanSheets: 58, minutes: 62, form: 71, goalThreat: 35, matchup: 64 },
      expectedPoints: 9.8,
      insightLines: [
        "High-low spread widening — minutes inconsistent.",
        "Two spike weeks, two quiet ones.",
        "Monitor starter status before next window.",
      ],
    },
  },
  "def-1": {
    trend: "up",
    profile: {
      baseForm: 10,
      volatility: 5,
      minutesBase: 430,
      matchPoints: [9, 11, 13, 12, 15],
      statValues: { cleanSheets: 81, goalThreat: 48, minutes: 92, form: 88, saves: 20, matchup: 85 },
      expectedPoints: 13.1,
      insightLines: ["Clean-sheet rate climbing.", "Attacking returns adding upside.", "Elite floor this window."],
    },
  },
  "def-2": {
    trend: "flat",
    profile: {
      baseForm: 8,
      volatility: 4,
      minutesBase: 390,
      matchPoints: [7, 8, 9, 8, 8],
      statValues: { cleanSheets: 74, goalThreat: 40, minutes: 88, form: 79, saves: 15, matchup: 76 },
      expectedPoints: 8.6,
      insightLines: ["Steady but unspectacular output.", "Defensive actions consistent.", "Limited ceiling this stretch."],
    },
  },
  "def-3": {
    trend: "down",
    profile: {
      baseForm: 12,
      volatility: 6,
      minutesBase: 360,
      matchPoints: [14, 11, 8, 6, 5],
      statValues: { cleanSheets: 68, goalThreat: 52, minutes: 80, form: 72, saves: 18, matchup: 70 },
      expectedPoints: 7.2,
      insightLines: ["Cooling off after hot start.", "Opponent quality toughening.", "Conversion on chances down."],
    },
  },
  "def-4": {
    trend: "volatile",
    profile: {
      baseForm: 9,
      volatility: 11,
      minutesBase: 320,
      matchPoints: [18, 3, 16, 4, 12],
      statValues: { cleanSheets: 62, goalThreat: 55, minutes: 74, form: 69, saves: 12, matchup: 66 },
      expectedPoints: 10.5,
      insightLines: ["Big swings week to week.", "Set-piece threat remains live.", "Risk profile elevated."],
    },
  },
  "def-5": {
    trend: "up",
    profile: {
      baseForm: 7,
      volatility: 5,
      minutesBase: 400,
      matchPoints: [5, 7, 9, 10, 12],
      statValues: { cleanSheets: 77, goalThreat: 44, minutes: 90, form: 84, saves: 10, matchup: 82 },
      expectedPoints: 11.0,
      insightLines: ["Breakout window — form rising.", "Minutes locked in.", "Under-the-radar value."],
    },
  },
  "mid-1": {
    trend: "up",
    profile: {
      baseForm: 13,
      volatility: 5,
      minutesBase: 440,
      matchPoints: [10, 14, 16, 18, 20],
      statValues: { goalThreat: 86, form: 91, matchup: 88, minutes: 95, saves: 0, cleanSheets: 0 },
      expectedPoints: 17.2,
      insightLines: ["Stock rising — elite floor.", "Chance creation volume up 38%.", "Likely starter every match."],
    },
  },
  "mid-2": {
    trend: "flat",
    profile: {
      baseForm: 11,
      volatility: 4,
      minutesBase: 410,
      matchPoints: [11, 10, 12, 11, 10],
      statValues: { goalThreat: 78, form: 80, matchup: 82, minutes: 91, saves: 0, cleanSheets: 0 },
      expectedPoints: 11.4,
      insightLines: ["Reliable mid-tier returns.", "Key passes steady.", "Limited explosive upside."],
    },
  },
  "mid-3": {
    trend: "down",
    profile: {
      baseForm: 15,
      volatility: 6,
      minutesBase: 380,
      matchPoints: [19, 16, 12, 9, 7],
      statValues: { goalThreat: 82, form: 74, matchup: 71, minutes: 85, saves: 0, cleanSheets: 0 },
      expectedPoints: 9.1,
      insightLines: ["Cooling off after peak stretch.", "xA still strong but finishes drying up.", "Watch rotation risk."],
    },
  },
  "mid-4": {
    trend: "volatile",
    profile: {
      baseForm: 10,
      volatility: 12,
      minutesBase: 300,
      matchPoints: [22, 5, 20, 3, 14],
      statValues: { goalThreat: 70, form: 68, matchup: 65, minutes: 68, saves: 0, cleanSheets: 0 },
      expectedPoints: 11.8,
      insightLines: ["High variance — boom or bust.", "Two hauls, two blanks.", "Volatile candle flagged."],
    },
  },
  "mid-5": {
    trend: "up",
    profile: {
      baseForm: 9,
      volatility: 5,
      minutesBase: 350,
      matchPoints: [6, 8, 11, 13, 15],
      statValues: { goalThreat: 83, form: 87, matchup: 84, minutes: 86, saves: 0, cleanSheets: 0 },
      expectedPoints: 13.7,
      insightLines: ["Hidden value — xA ranks top five.", "Under-selected as starter.", "Heating up late in window."],
    },
  },
  "fwd-1": {
    trend: "up",
    profile: {
      baseForm: 14,
      volatility: 6,
      minutesBase: 420,
      matchPoints: [12, 16, 18, 22, 24],
      statValues: { goalThreat: 94, form: 92, matchup: 90, minutes: 93, saves: 0, cleanSheets: 0 },
      expectedPoints: 18.6,
      insightLines: ["Player stock rising.", "Conversion rate up 42% this window.", "Team's top scoring threat."],
    },
  },
  "fwd-2": {
    trend: "down",
    profile: {
      baseForm: 18,
      volatility: 7,
      minutesBase: 390,
      matchPoints: [24, 20, 14, 10, 8],
      statValues: { goalThreat: 88, form: 76, matchup: 74, minutes: 88, saves: 0, cleanSheets: 0 },
      expectedPoints: 10.2,
      insightLines: ["Cooling off — chances still there.", "Opportunity volume high, conversion down 37%.", "Bearish current candle."],
    },
  },
  "fwd-3": {
    trend: "volatile",
    profile: {
      baseForm: 11,
      volatility: 10,
      minutesBase: 310,
      matchPoints: [21, 6, 19, 4, 16],
      statValues: { goalThreat: 79, form: 73, matchup: 70, minutes: 72, saves: 0, cleanSheets: 0 },
      expectedPoints: 12.9,
      insightLines: ["Volatile profile — streaky finisher.", "Two double-digit weeks, two blanks.", "High risk, high reward."],
    },
  },
};

export const valueTrendTemplates: Record<string, ValueTrendTemplate> = Object.fromEntries(
  squadPitchFormation.map((slot) => {
    const entry = slotProfiles[slot.id];
    return [
      slot.id,
      buildTemplate(slot.position, entry.profile, entry.trend),
    ];
  }),
);

/** Demo mode: swap templates so placeholders do not mirror slot order literally. */
export const demoTemplateSwap: Record<string, string> = {
  "gk-1": "gk-2",
  "gk-2": "gk-1",
  "def-1": "def-4",
  "def-2": "def-5",
  "def-3": "def-2",
  "def-4": "def-1",
  "def-5": "def-3",
  "mid-1": "mid-3",
  "mid-2": "mid-5",
  "mid-3": "mid-1",
  "mid-4": "mid-2",
  "mid-5": "mid-4",
  "fwd-1": "fwd-3",
  "fwd-2": "fwd-1",
  "fwd-3": "fwd-2",
};

export function getTemplateForSlot(
  slotId: string,
  demoMode: boolean,
): ValueTrendTemplate {
  const templateId = demoMode ? (demoTemplateSwap[slotId] ?? slotId) : slotId;
  return valueTrendTemplates[templateId] ?? valueTrendTemplates[slotId];
}

export function getSlotLabel(slotId: string): string {
  const slot = squadPitchFormation.find((entry) => entry.id === slotId);
  if (!slot) return slotId;
  const labels: Record<SquadPositionCode, string> = {
    GKP: "GK",
    DEF: "DEF",
    MID: "MID",
    FWD: "FWD",
  };
  const match = slotId.match(/^(gk|def|mid|fwd)-(\d+)$/);
  const num = match?.[2] ?? "";
  return `${labels[slot.position]} ${num}`;
}
