import { en, type Messages } from "@/messages/en";

type Leaf = string | number | boolean | null | undefined;
type MessageTree = { [k: string]: MessageTree } | Leaf;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function getByPath(root: MessageTree, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = root;
  for (const p of parts) {
    if (!isRecord(cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

/**
 * Minimal i18n: English only, `t("a.b")` with `{name}` interpolation.
 */
export function t(
  path: keyof Messages | string,
  vars?: Record<string, string | number>,
): string {
  const raw = getByPath(en as unknown as MessageTree, String(path));
  if (typeof raw !== "string") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] Missing string: ${path}`);
    }
    return String(path);
  }
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}
