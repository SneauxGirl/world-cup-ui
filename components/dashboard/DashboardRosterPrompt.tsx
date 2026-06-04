import Link from "next/link";
import { IconChevronRight } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import styles from "./DashboardRosterPrompt.module.scss";

type Props = {
  className?: string;
};

export function DashboardRosterPrompt({ className }: Props) {
  return (
    <aside
      className={[styles.promptRegion, className].filter(Boolean).join(" ")}
      aria-label={t("dashboard.rosterPromptLabel")}
    >
      <div className={styles.promptFrame}>
        <div className={styles.promptCard}>
          <p className={styles.promptText}>{t("dashboard.rosterPromptBanner")}</p>
          <Link href="/roster" className={styles.promptLink}>
            {t("dashboard.setYourRoster")}
            <IconChevronRight className={styles.promptLinkIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
