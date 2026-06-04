"use client";

import Image from "next/image";
import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { DashboardPerformer } from "@/data/types";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import styles from "./HeroPerformerCard.module.scss";

type Props = {
  performer: DashboardPerformer;
};

function getLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] ?? fullName;
}

export function HeroPerformerCard({ performer }: Props) {
  const jerseySrc = getTeamJerseyPath(performer.teamCode);
  const displayName = getLastName(performer.name);

  return (
    <article className={styles.heroFrame}>
      <div className={styles.heroTrigger}>
        <div className={styles.heroPortrait} aria-hidden="true">
          <Image
            src={jerseySrc}
            alt=""
            width={400}
            height={520}
            className={styles.heroPortraitJersey}
            sizes="(max-width: 768px) 40vw, 360px"
          />
        </div>
        <header className={styles.heroHeader}>
          <h3 className={styles.heroName}>{displayName}</h3>
          <p className={styles.heroMeta}>
            <span>{performer.teamCode}</span>
            <span className={styles.heroMetaDivider} aria-hidden="true">
              {" · "}
            </span>
            <span>{performer.position}</span>
          </p>
        </header>
        <p className={styles.heroPoints}>
          {t("player.points", { pts: formatInteger(performer.points) })}
        </p>
      </div>
    </article>
  );
}
