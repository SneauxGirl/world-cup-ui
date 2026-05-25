"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IconClose, IconMenu, IconSearch } from "@/components/icons/DashboardIcons";
import { MenuUserFooter } from "@/components/dashboard/MenuUserFooter";
import { SearchModal } from "@/components/dashboard/SearchModal";
import {
  getSiteHeaderMobileDrawerItems,
  SITE_HEADER_MORE_KEY,
} from "@/data/site-header-nav";
import { userDashboard } from "@/data/dashboard-seed";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import navStyles from "./Navigation.module.scss";
import drawerStyles from "./SiteHeaderDrawer.module.scss";

const menuItems = [
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

type Props = {
  onAccountClick?: () => void;
};

const siteDrawerItems = getSiteHeaderMobileDrawerItems();

export function HeroNavMenu({ onAccountClick }: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const menuId = useId();

  const closeMenu = useCallback(() => {
    setSearchOpen(false);
    setOpen(false);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const handleAccountClick = useCallback(() => {
    closeMenu();
    onAccountClick?.();
  }, [closeMenu, onAccountClick]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open || searchOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () => {
      const nodes: HTMLElement[] = [];
      nodes.push(...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)));
      if (menuBtnRef.current) nodes.push(menuBtnRef.current);
      return nodes.filter((el) => !el.hasAttribute("disabled"));
    };

    closeBtnRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

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
  }, [open, searchOpen, closeMenu]);

  useEffect(() => {
    if (open) return;
    setSearchOpen(false);
    menuBtnRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={menuBtnRef}
        type="button"
        className={navStyles.menuBtn}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {open ? <IconClose /> : <IconMenu />}
        <span className={navStyles.srOnly}>
          {open ? t("nav.closeMenu") : t("nav.openMenu")}
        </span>
      </button>

      {open ? (
        <>
          <button
            ref={overlayRef}
            type="button"
            className={navStyles.menuOverlay}
            aria-label={t("nav.closeMenu")}
            onClick={closeMenu}
          />
          <div className={[navStyles.menuPanelShell, drawerStyles.panelShellTall].join(" ")}>
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
                  onClick={closeMenu}
                >
                  <IconClose />
                </button>
              </div>
              <nav className={navStyles.menuNav} aria-label="Primary">
                <ul className={navStyles.menuList}>
                  {menuItems.map((item) => {
                    const active = item.key === "dashboard";
                    return (
                      <li key={item.key}>
                        <Link
                          className={active ? navStyles.menuLinkActive : navStyles.menuLink}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          {t(`nav.${item.key}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <p className={drawerStyles.sectionLabel}>{t(`footer.${SITE_HEADER_MORE_KEY}`)}</p>
                <ul className={navStyles.menuList}>
                  {siteDrawerItems.map((item) => (
                    <li key={item.key}>
                      <Link
                        className={navStyles.menuLink}
                        href={item.href}
                        onClick={closeMenu}
                      >
                        {t(`footer.${item.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className={navStyles.menuSearchRow}>
                  <button
                    ref={searchBtnRef}
                    type="button"
                    className={navStyles.menuPanelIconBtn}
                    aria-label={t("footer.search")}
                    onClick={() => setSearchOpen(true)}
                  >
                    <IconSearch />
                  </button>
                </div>
              </nav>
              <div className={navStyles.menuProfile}>
                <MenuUserFooter user={userDashboard} onAccountClick={handleAccountClick} />
              </div>
            </div>
          </div>
          <SearchModal open={searchOpen} onClose={closeSearch} placement="menu" />
        </>
      ) : null}
    </>
  );
}
