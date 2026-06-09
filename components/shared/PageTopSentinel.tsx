import { PAGE_TOP_ID } from "@/lib/scrollToPageTop";
import { t } from "@/lib/i18n/t";
import styles from "./PageTopSentinel.module.scss";

/** Programmatic focus target for Back to top — not in normal tab order. */
export function PageTopSentinel() {
  return (
    <div id={PAGE_TOP_ID} tabIndex={-1} className={styles.sentinel}>
      <span className={styles.srOnly}>{t("a11y.pageTop")}</span>
    </div>
  );
}
