// Structure for international usage.

const dateFmt = new Intl.DateTimeFormat("en", {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function formatKickoff(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatInteger(n: number): string {
  return new Intl.NumberFormat("en").format(n);
}

/** "Heather Hugo" → "Heather H."; one word is unchanged. */
export function formatFirstNameLastInitial(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  const first = parts[0]!;
  const lastInitial = parts[parts.length - 1]!.charAt(0).toLocaleUpperCase("en");
  return `${first} ${lastInitial}.`;
}
