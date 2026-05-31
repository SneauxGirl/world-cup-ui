"use client";

import { useId } from "react";
import { IconSearch } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import styles from "./SquadPlayerSearch.module.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SquadPlayerSearch({ value, onChange, className }: Props) {
  const inputId = useId();

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <label htmlFor={inputId} className={styles.label}>
        {t("squadSelection.playerSearchLabel")}
      </label>
      <div className={styles.field}>
        <span className={styles.fieldIcon} aria-hidden="true">
          <IconSearch />
        </span>
        <input
          id={inputId}
          type="search"
          role="searchbox"
          className={styles.input}
          value={value}
          placeholder={t("squadSelection.playerSearchPlaceholder")}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
