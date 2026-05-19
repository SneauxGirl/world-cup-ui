import Image from "next/image";
import { t } from "@/lib/i18n/t";
import { formatInteger } from "@/lib/i18n/format";
import type { DashboardPerformer } from "@/data/types";
import { getTeamJerseyPath } from "@/lib/nationalTeams";
import styles from "./PerformerCard.module.scss";

type Props = {
  performer: DashboardPerformer;
};

export function PerformerCard({ performer }: Props) {
  const jerseySrc = getTeamJerseyPath(performer.teamCode);

  return (
    <article className={styles.cardFrame}>
      <div className={styles.cardInner}>
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
          <h3 className={styles.name}>{performer.name}</h3>
          <p className={styles.meta}>
            {t("player.position", {
              team: performer.teamCode,
              pos: performer.position,
            })}
          </p>
        </header>
        <p className={styles.points}>
          {t("player.points", { pts: formatInteger(performer.points) })}
        </p>
      </div>
    </article>
  );
}
