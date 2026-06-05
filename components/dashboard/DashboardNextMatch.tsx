import Image from "next/image";
import { t } from "@/lib/i18n/t";
import styles from "./DashboardNextMatch.module.scss";

const NEXT_MATCH_ART_SRC = "/bwhite.png";
const NEXT_MATCH_ART_WIDTH = 360;
const NEXT_MATCH_ART_HEIGHT = 360;

type Props = {
  className?: string;
  /** Opponent display name for the upcoming fixture. */
  opponentName?: string;
  dimmed?: boolean;
};

export function DashboardNextMatch({
  className,
  opponentName = "FEN United",
  dimmed = false,
}: Props) {
  return (
    <aside
      className={[styles.nextMatch, className].filter(Boolean).join(" ")}
      aria-label={t("dashboard.nextMatchLabel", { team: opponentName })}
    >
      <div className={[styles.inner, dimmed && styles.innerDimmed].filter(Boolean).join(" ")}>
        <figure className={styles.art} aria-hidden="true">
          <Image
            src={NEXT_MATCH_ART_SRC}
            alt=""
            width={NEXT_MATCH_ART_WIDTH}
            height={NEXT_MATCH_ART_HEIGHT}
            className={styles.artImage}
            sizes="(max-width: 768px) 88px, 120px"
          />
        </figure>
        <p className={styles.line}>
          <span className={styles.prefix}>{t("dashboard.nextMatchPrefix")}</span>{" "}
          <span className={styles.team}>{opponentName}</span>
        </p>
      </div>
    </aside>
  );
}
