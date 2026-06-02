"use client";

import Image from "next/image";
import Link from "next/link";
import { IconChevronDown } from "@/components/icons/DashboardIcons";
import {
  dashboardFooterEchoNavItems,
  dashboardFooterLegalLinks,
  dashboardFooterNavColumns,
  getDashboardFooterNavItemsRowMajor,
} from "@/data/dashboard-footer";
import { t } from "@/lib/i18n/t";
import styles from "./DashboardSiteFooter.module.scss";

const COPYRIGHT_YEAR = 2026;

export function DashboardSiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.mainNav} aria-label={t("loginFooter.navLabel")}>
        <ul className={styles.navColumns}>
          {dashboardFooterNavColumns.map((column, columnIndex) => (
            <li key={column.map((item) => item.id).join("-")} className={styles.navColumn}>
              <ul className={styles.navColumnList}>
                {column.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      aria-disabled={item.href === "#" ? true : undefined}
                      onClick={item.href === "#" ? (event) => event.preventDefault() : undefined}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
              {columnIndex < dashboardFooterNavColumns.length - 1 ? (
                <span className={styles.navDivider} aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ul>
        <ul className={styles.navStack}>
          {getDashboardFooterNavItemsRowMajor().map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.navLink}
                aria-disabled={item.href === "#" ? true : undefined}
                onClick={item.href === "#" ? (event) => event.preventDefault() : undefined}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={styles.echoNav} aria-label={t("footer.navLabel")}>
        <ul className={styles.echoNavList}>
          {dashboardFooterEchoNavItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.echoNavLink}
                aria-disabled={item.href === "#" ? true : undefined}
                onClick={item.href === "#" ? (event) => event.preventDefault() : undefined}
              >
                <span>{t(item.labelKey)}</span>
                {item.hasMenu ? <IconChevronDown className={styles.echoNavChevron} /> : null}
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
            {dashboardFooterLegalLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={styles.legalLink}
                  aria-disabled={item.href === "#" ? true : undefined}
                  onClick={item.href === "#" ? (event) => event.preventDefault() : undefined}
                >
                  {t(item.labelKey)}
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
        <Link href="/dashboard" className={styles.legalBrand} aria-label={t("app.name")}>
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
