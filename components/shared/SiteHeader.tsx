"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { IconChevronDown, IconMenu } from "@/components/icons/DashboardIcons";
import { SiteHeaderDrawer } from "@/components/shared/SiteHeaderDrawer";
import { dashboardAppNavItems } from "@/data/dashboard-app-nav-items";
import {
  getSiteHeaderMobilePinnedItems,
  SITE_HEADER_MORE_KEY,
  siteHeaderNavItems,
  type SiteHeaderNavItem,
} from "@/data/site-header-nav";
import { getDashboardAppNavActiveKey } from "@/lib/dashboard-app-nav";
import { useSiteHeaderCollapsed, useMediaQuery } from "@/hooks/useMediaQuery";
import {
  MOBILE_MAX_WIDTH_PX,
  SIDEBAR_MIN_WIDTH_PX,
  mediaMaxWidthQuery,
} from "@/lib/media";
import { t } from "@/lib/i18n/t";
import navStyles from "./SiteNavMenu.module.scss";
import styles from "./SiteHeader.module.scss";

const ITEM_GAP_PX = 17.6; /* ~1.1rem — matches .menuList gap */
const TITLE_MENU_GAP_PX = 20;

type BrandVariant = "login" | "dashboard";

type Props = {
  className?: string;
  brand?: BrandVariant;
  /** Dashboard: search + account controls in the header bar. */
  utilities?: ReactNode;
  /** Dashboard mobile: inline search at the top of the header drawer. */
  drawerSearch?: ComponentType;
};

function NavItemControl({ item }: { item: SiteHeaderNavItem }) {
  const label = t(`footer.${item.key}`);

  if (item.hasMenu) {
    return (
      <button type="button" className={styles.navControl} aria-haspopup="true">
        <span>{label}</span>
        <IconChevronDown className={styles.chevron} />
      </button>
    );
  }

  return (
    <Link href={item.href} className={styles.navControl}>
      {label}
    </Link>
  );
}

function AppNavItemControl({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={active ? styles.navControlActive : styles.navControl}
      aria-current={active ? "page" : undefined}
      aria-disabled={href === "#" ? true : undefined}
      onClick={href === "#" ? (event) => event.preventDefault() : undefined}
    >
      {label}
    </Link>
  );
}

export function SiteHeader({ className, brand = "login", utilities, drawerSearch }: Props) {
  const pathname = usePathname();
  const activeAppKey = getDashboardAppNavActiveKey(pathname);
  const rootClass = [
    styles.header,
    (brand === "login" || brand === "dashboard") && styles.headerEdgeAlign,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const navId = useId();
  const moreMenuId = useId();
  const isHeaderCollapsed = useSiteHeaderCollapsed();
  const isMobile = useMediaQuery(mediaMaxWidthQuery(MOBILE_MAX_WIDTH_PX));
  const hasSidebar = useMediaQuery(`(min-width: ${SIDEBAR_MIN_WIDTH_PX}px)`);
  const isTabletAppNav = brand === "dashboard" && !hasSidebar && !isMobile;
  const useCompactHeader =
    (brand === "dashboard" && isMobile) || (brand === "login" && isHeaderCollapsed);
  const showDrawerMenu = useCompactHeader;
  const isDashboardCompactBar = brand === "login" && isHeaderCollapsed;
  const primaryNavItems = isTabletAppNav ? dashboardAppNavItems : siteHeaderNavItems;

  const navRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const itemMeasureRefs = useRef(new Map<string, HTMLSpanElement>());
  const utilitiesRef = useRef<HTMLElement | null>(null);
  const moreWrapRef = useRef<HTMLLIElement>(null);

  const [visibleCount, setVisibleCount] = useState<number>(primaryNavItems.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const overflowItems = siteHeaderNavItems.slice(visibleCount);
  const visibleItems = siteHeaderNavItems.slice(0, visibleCount);
  const visibleAppItems = dashboardAppNavItems.slice(0, visibleCount);
  const showFifaMore = !isTabletAppNav && overflowItems.length > 0;
  const showMoreButton = isTabletAppNav || showFifaMore;
  const moreMenuItems: readonly SiteHeaderNavItem[] = isTabletAppNav
    ? siteHeaderNavItems
    : overflowItems;
  const mobilePinned = getSiteHeaderMobilePinnedItems();
  const drawerMoreItems =
    brand === "dashboard" && isMobile ? siteHeaderNavItems : isDashboardCompactBar ? [] : [];
  const brandHref = brand === "dashboard" ? "/dashboard" : "/";

  const measureFit = useCallback(() => {
    if (useCompactHeader) return;

    const nav = navRef.current;
    const brandEl = brandRef.current;
    const moreProbe = moreMeasureRef.current;
    if (!nav || !brandEl || !moreProbe) return;

    const navRect = nav.getBoundingClientRect();
    const brandRect = brandEl.getBoundingClientRect();
    if (navRect.width <= 0) return;

    const moreWidth = moreProbe.offsetWidth;
    const utilitiesWidth = utilitiesRef.current?.offsetWidth ?? 0;

    let trailingReserve = TITLE_MENU_GAP_PX;
    if (utilitiesWidth > 0) trailingReserve += utilitiesWidth + ITEM_GAP_PX;

    const available = Math.max(0, navRect.right - brandRect.right - trailingReserve);

    const countFit = (reserveMore: boolean) => {
      let budget = available;
      if (reserveMore) budget -= moreWidth + ITEM_GAP_PX;

      let fit = 0;
      for (const item of primaryNavItems) {
        const probe = itemMeasureRefs.current.get(item.key);
        const itemWidth = probe?.offsetWidth ?? 0;
        const need = itemWidth + (fit > 0 ? ITEM_GAP_PX : 0);

        if (need <= budget) {
          budget -= need;
          fit += 1;
        } else {
          break;
        }
      }
      return fit;
    };

    let fit = countFit(isTabletAppNav);
    if (fit < primaryNavItems.length) {
      fit = countFit(true);
    }

    setVisibleCount(fit);
  }, [isTabletAppNav, primaryNavItems, useCompactHeader]);

  useLayoutEffect(() => {
    measureFit();
  }, [measureFit]);

  useEffect(() => {
    if (useCompactHeader) {
      setVisibleCount(primaryNavItems.length);
      setMoreOpen(false);
      if (!showDrawerMenu) setDrawerOpen(false);
      return;
    }

    if (!showDrawerMenu) {
      setDrawerOpen(false);
    }

    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => measureFit());
    const brandEl = brandRef.current;
    const utilitiesEl = utilitiesRef.current;
    observer.observe(nav);
    if (brandEl) observer.observe(brandEl);
    if (utilitiesEl) observer.observe(utilitiesEl);
    window.addEventListener("resize", measureFit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureFit);
    };
  }, [useCompactHeader, showDrawerMenu, measureFit, primaryNavItems.length]);

  useEffect(() => {
    if (!showMoreButton) setMoreOpen(false);
  }, [showMoreButton]);

  useEffect(() => {
    if (!moreOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMoreOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (moreWrapRef.current?.contains(target)) return;
      setMoreOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [moreOpen]);

  const brandNode =
    brand === "dashboard" ? (
      <Link href={brandHref} className={styles.brandLogoLink} ref={brandRef}>
        <Image
          src="/wcc-words-only-logo.png"
          alt={t("app.name")}
          width={370}
          height={40}
          className={styles.brandLogo}
          priority
        />
      </Link>
    ) : (
      <Link
        href={brandHref}
        className={styles.brandTitleLink}
        ref={brandRef}
        aria-label={t("app.name")}
      >
        <span className={styles.headerBrand}>{t("app.name")}</span>
      </Link>
    );

  return (
    <header className={rootClass}>
      <div className={styles.inner}>
        <nav
          ref={navRef}
          className={styles.siteNav}
          aria-label={isTabletAppNav ? t("nav.menuDialogLabel") : t("footer.navLabel")}
        >
          {!useCompactHeader ? (
            <ul className={styles.measureList} aria-hidden="true">
              {primaryNavItems.map((item) => (
                <li key={`measure-${item.key}`}>
                  <span
                    ref={(node) => {
                      if (node) itemMeasureRefs.current.set(item.key, node);
                      else itemMeasureRefs.current.delete(item.key);
                    }}
                    className={styles.measureProbe}
                  >
                    {isTabletAppNav ? (
                      <AppNavItemControl
                        href={item.href}
                        label={t(`nav.${item.key}`)}
                        active={false}
                      />
                    ) : (
                      <NavItemControl item={item as SiteHeaderNavItem} />
                    )}
                  </span>
                </li>
              ))}
              <li>
                <span ref={moreMeasureRef} className={styles.measureProbe}>
                  <button type="button" className={styles.navControl} tabIndex={-1}>
                    <span>{t(`footer.${SITE_HEADER_MORE_KEY}`)}</span>
                    <IconChevronDown className={styles.chevron} />
                  </button>
                </span>
              </li>
            </ul>
          ) : null}

          <ul
            id={navId}
            className={[styles.linkList, useCompactHeader && styles.linkListMobile]
              .filter(Boolean)
              .join(" ")}
          >
            {useCompactHeader ? (
              <>
                <li className={styles.menuBtnWrap}>
                  <button
                    type="button"
                    className={navStyles.menuBtn}
                    aria-expanded={drawerOpen}
                    aria-controls="site-header-drawer"
                    onClick={() => setDrawerOpen((open) => !open)}
                  >
                    <IconMenu />
                    <span className={navStyles.srOnly}>{t("nav.openMenu")}</span>
                  </button>
                </li>
                <li className={styles.brandCell}>{brandNode}</li>
                <li className={styles.mobileEndCell}>
                  {isDashboardCompactBar ? (
                    <ul className={styles.mobilePinnedList}>
                      {mobilePinned.map((item) => (
                        <li key={item.key}>
                          <NavItemControl item={item} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {utilities ? (
                    <div
                      ref={(node) => {
                        if (node) utilitiesRef.current = node;
                        else utilitiesRef.current = null;
                      }}
                      className={styles.utilitiesCell}
                    >
                      {utilities}
                    </div>
                  ) : null}
                </li>
              </>
            ) : (
              <>
                <li className={styles.brandCell}>{brandNode}</li>
                <li className={styles.menuCell}>
                  <ul className={styles.menuList}>
                  {isTabletAppNav
                    ? visibleAppItems.map((item) => (
                        <li key={item.key}>
                          <AppNavItemControl
                            href={item.href}
                            label={t(`nav.${item.key}`)}
                            active={item.key === activeAppKey}
                          />
                        </li>
                      ))
                    : visibleItems.map((item) => (
                        <li key={item.key}>
                          <NavItemControl item={item} />
                        </li>
                      ))}
                  {showMoreButton ? (
                    <li ref={moreWrapRef} className={styles.moreWrap}>
                      <button
                        type="button"
                        className={styles.navControl}
                        aria-expanded={moreOpen}
                        aria-haspopup="menu"
                        aria-controls={moreMenuId}
                        onClick={() => setMoreOpen((open) => !open)}
                      >
                        <span>{t(`footer.${SITE_HEADER_MORE_KEY}`)}</span>
                        <IconChevronDown className={styles.chevron} />
                      </button>
                      {moreOpen ? (
                        <ul
                          id={moreMenuId}
                          className={styles.moreMenu}
                          role="menu"
                          aria-label={t(`footer.${SITE_HEADER_MORE_KEY}`)}
                        >
                          {moreMenuItems.map((item) => (
                            <li key={item.key} role="none">
                              <Link
                                href={item.href}
                                className={styles.moreMenuLink}
                                role="menuitem"
                                onClick={() => setMoreOpen(false)}
                              >
                                {t(`footer.${item.key}`)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ) : null}
                  {utilities ? (
                    <li
                      ref={(node) => {
                        if (node) utilitiesRef.current = node;
                        else utilitiesRef.current = null;
                      }}
                      className={styles.utilitiesCell}
                    >
                      {utilities}
                    </li>
                  ) : null}
                  </ul>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {showDrawerMenu ? (
        <SiteHeaderDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant={brand}
          moreNavItems={drawerMoreItems}
          leading={
            brand === "dashboard" && drawerSearch ? createElement(drawerSearch) : undefined
          }
        />
      ) : null}
    </header>
  );
}
