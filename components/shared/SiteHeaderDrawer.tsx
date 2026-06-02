"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { IconClose } from "@/components/icons/DashboardIcons";
import {
  SITE_HEADER_MORE_KEY,
  siteHeaderNavItems,
  type SiteHeaderNavItem,
} from "@/data/site-header-nav";
import { getDashboardAppNavActiveKey } from "@/lib/dashboard-app-nav";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import navStyles from "./SiteNavMenu.module.scss";
import styles from "./SiteHeaderDrawer.module.scss";

import { dashboardAppNavItems } from "@/data/dashboard-app-nav-items";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function DrawerSiteLink({
  item,
  onNavigate,
  secondary = false,
}: {
  item: SiteHeaderNavItem;
  onNavigate: () => void;
  secondary?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={[navStyles.menuLink, secondary && styles.menuLinkSecondary]
        .filter(Boolean)
        .join(" ")}
      onClick={onNavigate}
    >
      {t(`footer.${item.key}`)}
    </Link>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  variant: "login" | "dashboard";
  /** FIFA nav items currently in the header “More” overflow (dashboard only). */
  moreNavItems?: readonly SiteHeaderNavItem[];
  /** Rendered at the top of the drawer nav (e.g. mobile search). */
  leading?: ReactNode;
};

export function SiteHeaderDrawer({
  open,
  onClose,
  variant,
  moreNavItems = [],
  leading,
}: Props) {
  const pathname = usePathname();
  const activeKey = getDashboardAppNavActiveKey(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const moreSectionId = useId();
  const menuId = useId();

  const handleNavigate = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;

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
        onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  const showDashboardSections = variant === "dashboard";
  const loginDrawerItems = siteHeaderNavItems;

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
          className={[
            navStyles.menuPanel,
            showDashboardSections && styles.menuPanelPortal,
          ]
            .filter(Boolean)
            .join(" ")}
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
            {leading}
            {showDashboardSections ? (
              <>
                <ul className={navStyles.menuList}>
                  {dashboardAppNavItems.map((item) => {
                    const active = item.key === activeKey;
                    return (
                      <li key={item.key}>
                        <Link
                          className={active ? navStyles.menuLinkActive : navStyles.menuLink}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          aria-disabled={item.href === "#" ? true : undefined}
                          onClick={(event) => {
                            if (item.href === "#") event.preventDefault();
                            handleNavigate();
                          }}
                        >
                          {t(`nav.${item.key}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {moreNavItems.length > 0 ? (
                  <section
                    className={styles.moreSection}
                    aria-labelledby={moreSectionId}
                  >
                    <hr className={styles.menuDivider} />
                    <h3 id={moreSectionId} className={styles.sectionLabel}>
                      {t(`footer.${SITE_HEADER_MORE_KEY}`)}
                    </h3>
                    <ul className={navStyles.menuList}>
                      {moreNavItems.map((item) => (
                        <li key={item.key}>
                          <DrawerSiteLink
                            item={item}
                            onNavigate={handleNavigate}
                            secondary
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </>
            ) : (
              <ul className={navStyles.menuList}>
                {loginDrawerItems.map((item) => (
                  <li key={item.key}>
                    <DrawerSiteLink item={item} onNavigate={handleNavigate} />
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
