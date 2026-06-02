"use client";

import Image from "next/image";
import { PlayerCardTrigger } from "@/components/dashboard/player-card/PlayerCardTrigger";
import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { DashboardPerformer } from "@/data/types";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import styles from "./PerformerCard.module.scss";

type Props = {
  performer: DashboardPerformer;
};

function getLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] ?? fullName;
}

export function PerformerCard({ performer }: Props) {
  const jerseySrc = getTeamJerseyPath(performer.teamCode);
  const displayName = getLastName(performer.name);

  return (
    <article className={styles.cardFrame}>
      <PlayerCardTrigger player={{ id: performer.id }} className={styles.cardInner}>
        <div className={styles.portrait} aria-hidden="true">
          <Image
            src={jerseySrc}
            alt=""
            width={400}
            height={520}
            className={styles.portraitJersey}
            sizes="(max-width: 768px) 55vw, 280px"
          />
        </div>
        <header className={styles.header}>
          <h3 className={styles.name}>{displayName}</h3>
          <p className={styles.meta}>
            <span>{performer.teamCode}</span>
            <span className={styles.metaDivider} aria-hidden="true">
              {" · "}
            </span>
            <span>{performer.position}</span>
          </p>
        </header>
        <p className={styles.points}>
          {t("player.points", { pts: formatInteger(performer.points) })}
        </p>
      </PlayerCardTrigger>
    </article>
  );
}
