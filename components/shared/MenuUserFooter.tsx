"use client";

import { GitHubOctocatIcon } from "@/components/icons/GitHubOctocatIcon";
import type { UserDashboard } from "@/data/types";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./MenuUserFooter.module.scss";

type Props = {
  user: UserDashboard;
  onAccountClick?: () => void;
};

export function MenuUserFooter({ user, onAccountClick }: Props) {
  const avatar =
    user.avatar === "octocat" ? (
      <span className={styles.avatarOctocat}>
        <GitHubOctocatIcon width={40} height={40} />
      </span>
    ) : null;

  return (
    <section className={styles.profile} aria-label={t("menu.profileSummary")}>
      {onAccountClick ? (
        <button
          type="button"
          className={styles.avatarFrame}
          onClick={onAccountClick}
          aria-label={t("auth.accountMenu")}
        >
          {avatar}
        </button>
      ) : (
        <div className={styles.avatarFrame} aria-hidden="true">
          {avatar}
        </div>
      )}
      <div className={styles.stats}>
        <div className={styles.statCol}>
          <span className={styles.statLabel}>{t("dashboard.totalPoints")}</span>
          <span className={styles.statValue}>{formatInteger(user.totalPoints)}</span>
          <span className={styles.statSub}>{t("menu.score")}</span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.statLabel}>{t("dashboard.globalRank")}</span>
          <span className={styles.statValue}>{formatInteger(user.rank)}</span>
          <span className={[styles.statSub, styles.statTopPercent].join(" ")}>
            {t("dashboard.topPercent", { pct: user.topPercent })}
          </span>
        </div>
      </div>
    </section>
  );
}
