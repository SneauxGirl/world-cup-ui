import { getFlagIconClasses } from "@/lib/countryFlags";
import styles from "./CountryFlag.module.scss";

type Props = {
  /** FIFA-style code (e.g. ARG, ENG). */
  code: string;
  className?: string;
  /** Accessible name when the flag is meaningful (e.g. “Argentina”). */
  label?: string;
};

/** Landscape SVG country flag (flag-icons, MIT). */
export function CountryFlag({ code, className, label }: Props) {
  const flagClasses = getFlagIconClasses(code);
  if (!flagClasses) return null;

  return (
    <span
      className={[styles.flag, flagClasses, className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
