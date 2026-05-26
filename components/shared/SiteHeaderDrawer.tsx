"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IconClose, IconSearch } from "@/components/icons/DashboardIcons";
import { MenuUserFooter } from "@/components/shared/MenuUserFooter";
import { SearchModal } from "@/components/shared/SearchModal";
import {
  getSiteHeaderMobileDrawerItems,
  SITE_HEADER_MORE_KEY,
  siteHeaderNavItems,
  type SiteHeaderNavItem,
} from "@/data/site-header-nav";
import { userDashboard } from "@/data/dashboard-seed";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import navStyles from "./SiteNavMenu.module.scss";
import styles from "./SiteHeaderDrawer.module.scss";

const dashboardMenuItems = [
  { key: "dashboard" as const, href: "/dashboard" },
  { key: "roster" as const, href: "/dashboard" },
  { key: "matches" as const, href: "/dashboard" },
  { key: "standings" as const, href: "/dashboard" },
  { key: "players" as const, href: "/dashboard" },
  { key: "tournament" as const, href: "/dashboard" },
  { key: "store" as const, href: "/dashboard" },
  { key: "settings" as const, href: "/dashboard" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function DrawerSiteLink({ item, onNavigate }: { item: SiteHeaderNavItem; onNavigate: () => void }) {
  return (
    <Link href={item.href} className={navStyles.menuLink} onClick={onNavigate}>
      {t(`footer.${item.key}`)}
    </Link>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  variant: "login" | "dashboard";
  onAccountClick?: () => void;
};

export function SiteHeaderDrawer({ open, onClose, variant, onAccountClick }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const menuId = useId();
  const dashboardDrawerItems = getSiteHeaderMobileDrawerItems();
  const loginDrawerItems = siteHeaderNavItems;

  const handleNavigate = useCallback(() => onClose(), [onClose]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchOpen(false);
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled"),
      );

    closeBtnRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (searchOpen) closeSearch();
        else onClose();
        return;
      }

      if (event.key !== "Tab" || searchOpen) return;

      const nodes = getFocusable();
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, searchOpen, onClose, closeSearch]);

  if (!open) return null;

  const showDashboardSections = variant === "dashboard";
  const fifaDrawerItems = showDashboardSections ? dashboardDrawerItems : loginDrawerItems;

  return (
    <>
      <button
        type="button"
        className={navStyles.menuOverlay}
        aria-label={t("nav.closeMenu")}
        onClick={onClose}
      />
      <div className={[navStyles.menuPanelShell, styles.panelShellTall].join(" ")}>
        <div
          id={menuId}
          ref={panelRef}
          className={navStyles.menuPanel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={navStyles.menuPanelHead}>
            <h2 id={titleId} className={navStyles.srOnly}>
              {t("nav.menuDialogLabel")}
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className={navStyles.menuPanelCloseBtn}
              aria-label={t("nav.closeMenu")}
              onClick={onClose}
            >
              <IconClose />
            </button>
          </div>
          <nav className={navStyles.menuNav} aria-label={t("footer.navLabel")}>
            {showDashboardSections ? (
              <ul className={navStyles.menuList}>
                {dashboardMenuItems.map((item) => {
                  const active = item.key === "dashboard";
                  return (
                    <li key={item.key}>
                      <Link
                        className={active ? navStyles.menuLinkActive : navStyles.menuLink}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={handleNavigate}
                      >
                        {t(`nav.${item.key}`)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {showDashboardSections ? (
              <p className={styles.sectionLabel}>{t(`footer.${SITE_HEADER_MORE_KEY}`)}</p>
            ) : null}
            <ul className={navStyles.menuList}>
              {fifaDrawerItems.map((item) => (
                <li key={item.key}>
                  <DrawerSiteLink item={item} onNavigate={handleNavigate} />
                </li>
              ))}
            </ul>
            {showDashboardSections ? (
              <div className={navStyles.menuSearchRow}>
                <button
                  type="button"
                  className={navStyles.menuPanelIconBtn}
                  aria-label={t("footer.search")}
                  onClick={() => setSearchOpen(true)}
                >
                  <IconSearch />
                </button>
              </div>
            ) : null}
          </nav>
          {showDashboardSections && onAccountClick ? (
            <div className={navStyles.menuProfile}>
              <MenuUserFooter
                user={userDashboard}
                onAccountClick={() => {
                  onClose();
                  onAccountClick();
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
      {showDashboardSections ? (
        <SearchModal open={searchOpen} onClose={closeSearch} placement="menu" />
      ) : null}
    </>
  );
}
