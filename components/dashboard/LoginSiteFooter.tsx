"use client";

import Image from "next/image";
import Link from "next/link";
import {
  loginFooterLegalLinks,
  loginFooterNavColumns,
  loginFooterPartners,
} from "@/data/login-footer";
import { t } from "@/lib/i18n/t";
import styles from "./LoginSiteFooter.module.scss";

const COPYRIGHT_YEAR = 2026;

export function LoginSiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <section className={styles.partners} aria-label={t("loginFooter.partnersLabel")}>
        <ul className={styles.partnersGrid}>
          {loginFooterPartners.map((partner) => (
            <li key={partner.id} className={styles.partnerCell}>
              <div
                className={[
                  styles.partnerLogo,
                  "logo" in partner && styles.partnerLogoHasImage,
                  styles[`partnerLogo_${partner.id}`],
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {"logo" in partner ? (
                  <Image
                    src={partner.logo}
                    alt=""
                    width={partner.logoWidth}
                    height={partner.logoHeight}
                    className={styles.partnerLogoImg}
                    unoptimized
                  />
                ) : null}
                {partner.name ? (
                  <span
                    className={[
                      styles.partnerName,
                      styles[`partnerLogo_${partner.id}`],
                    ].join(" ")}
                  >
                    {partner.name}
                  </span>
                ) : null}
              </div>
              <p className={styles.partnerRole}>
                {t(`loginFooter.roles.${partner.role}`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <nav className={styles.mainNav} aria-label={t("loginFooter.navLabel")}>
        <ul className={styles.navColumns}>
          {loginFooterNavColumns.map((column, columnIndex) => (
            <li key={column.join("-")} className={styles.navColumn}>
              <ul className={styles.navColumnList}>
                {column.map((itemKey) => (
                  <li key={itemKey}>
                    <Link href="#" className={styles.navLink}>
                      {t(`loginFooter.nav.${itemKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
              {columnIndex < loginFooterNavColumns.length - 1 ? (
                <span className={styles.navDivider} aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.legalBar}>
        <nav className={styles.legalNav} aria-label={t("loginFooter.legalLabel")}>
          <p className={styles.copyright}>
            {t("loginFooter.legal.copyright", { year: COPYRIGHT_YEAR })}
          </p>
          <ul className={styles.legalList}>
            {loginFooterLegalLinks.map((key) => (
              <li key={key}>
                <Link href="#" className={styles.legalLink}>
                  {t(`loginFooter.legal.${key}`)}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" className={styles.legalLink} onClick={scrollToTop}>
                {t("loginFooter.backToTop")}
              </button>
            </li>
          </ul>
        </nav>
        <Link href="/" className={styles.legalBrand} aria-label={t("app.name")}>
          <span className={styles.legalBrandText}>{t("app.name")}</span>
        </Link>
      </div>
    </footer>
  );
}
