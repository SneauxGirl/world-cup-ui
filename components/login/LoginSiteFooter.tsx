"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getLoginFooterNavItemsRowMajor,
  loginFooterLegalLinks,
  loginFooterNavColumns,
  loginFooterPartners,
} from "@/data/login-footer";
import { t } from "@/lib/i18n/t";
import { scrollToPageTop } from "@/lib/scrollToPageTop";
import styles from "./LoginSiteFooter.module.scss";

const COPYRIGHT_YEAR = 2026;

type Props = {
  showPartners?: boolean;
};

export function LoginSiteFooter({ showPartners = true }: Props) {
  return (
    <footer className={styles.footer}>
      {showPartners ? (
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
      ) : null}

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
        <ul className={styles.navStack}>
          {getLoginFooterNavItemsRowMajor().map((itemKey) => (
            <li key={itemKey}>
              <Link href="#" className={styles.navLink}>
                {t(`loginFooter.nav.${itemKey}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.legalBar}>
        <p className={styles.copyright}>
          {t("loginFooter.legal.copyright", { year: COPYRIGHT_YEAR })}
        </p>
        <nav className={styles.legalLinks} aria-label={t("loginFooter.legalLabel")}>
          <ul className={styles.legalList}>
            {loginFooterLegalLinks.map((key) => (
              <li key={key}>
                <Link href="#" className={styles.legalLink}>
                  {t(`loginFooter.legal.${key}`)}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" className={styles.legalLink} onClick={scrollToPageTop}>
                {t("loginFooter.backToTop")}
              </button>
            </li>
          </ul>
        </nav>
        <Link href="/" className={styles.legalBrand} aria-label={t("app.name")}>
          <Image
            src="/wcc-words-logo.png"
            alt=""
            width={512}
            height={256}
            className={styles.legalBrandLogo}
            unoptimized
          />
        </Link>
      </div>
    </footer>
  );
}
