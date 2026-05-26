"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IconChevronDown, IconMenu } from "@/components/icons/DashboardIcons";
import { SiteHeaderDrawer } from "@/components/shared/SiteHeaderDrawer";
import {
  getSiteHeaderMobilePinnedItems,
  SITE_HEADER_MORE_KEY,
  siteHeaderNavItems,
  type SiteHeaderNavItem,
} from "@/data/site-header-nav";
import { useSiteHeaderCollapsed } from "@/hooks/useMediaQuery";
import { t } from "@/lib/i18n/t";
import navStyles from "./SiteNavMenu.module.scss";
import styles from "./SiteHeader.module.scss";

const ITEM_GAP_PX = 17.6; /* ~1.1rem — matches .menuList gap */
const TITLE_MENU_GAP_PX = 20;

type BrandVariant = "login" | "dashboard";

type Props = {
  className?: string;
  brand?: BrandVariant;
  onAccountClick?: () => void;
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

export function SiteHeader({ className, brand = "login", onAccountClick }: Props) {
  const rootClass = [
    styles.header,
    brand === "login" && styles.headerEdgeAlign,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const navId = useId();
  const moreMenuId = useId();
  const isHeaderCollapsed = useSiteHeaderCollapsed();
  const isDashboardCompactBar = isHeaderCollapsed && brand === "dashboard";

  const navRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const itemMeasureRefs = useRef(new Map<string, HTMLSpanElement>());
  const moreWrapRef = useRef<HTMLLIElement>(null);

  const [visibleCount, setVisibleCount] = useState<number>(siteHeaderNavItems.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const overflowItems = siteHeaderNavItems.slice(visibleCount);
  const visibleItems = siteHeaderNavItems.slice(0, visibleCount);
  const showMore = !isHeaderCollapsed && overflowItems.length > 0;
  const mobilePinned = getSiteHeaderMobilePinnedItems();
  const brandHref = brand === "dashboard" ? "/dashboard" : "/";

  const measureFit = useCallback(() => {
    if (isHeaderCollapsed) return;

    const nav = navRef.current;
    const brandEl = brandRef.current;
    const moreProbe = moreMeasureRef.current;
    if (!nav || !brandEl || !moreProbe) return;

    const navRect = nav.getBoundingClientRect();
    const brandRect = brandEl.getBoundingClientRect();
    if (navRect.width <= 0) return;

    const moreWidth = moreProbe.offsetWidth;
    const available = Math.max(0, navRect.right - brandRect.right - TITLE_MENU_GAP_PX);

    const countFit = (reserveMore: boolean) => {
      let budget = available;
      if (reserveMore) budget -= moreWidth + ITEM_GAP_PX;

      let fit = 0;
      for (const item of siteHeaderNavItems) {
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

    let fit = countFit(false);
    if (fit < siteHeaderNavItems.length) {
      fit = countFit(true);
    }

    setVisibleCount(fit);
  }, [isHeaderCollapsed]);

  useLayoutEffect(() => {
    measureFit();
  }, [measureFit]);

  useEffect(() => {
    if (isHeaderCollapsed) {
      setVisibleCount(siteHeaderNavItems.length);
      setMoreOpen(false);
      setDrawerOpen(false);
      return;
    }

    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => measureFit());
    const brandEl = brandRef.current;
    observer.observe(nav);
    if (brandEl) observer.observe(brandEl);
    window.addEventListener("resize", measureFit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureFit);
    };
  }, [isHeaderCollapsed, measureFit]);

  useEffect(() => {
    if (!showMore) setMoreOpen(false);
  }, [showMore]);

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
          aria-label={t("footer.navLabel")}
        >
          {!isHeaderCollapsed ? (
            <ul className={styles.measureList} aria-hidden="true">
              {siteHeaderNavItems.map((item) => (
                <li key={`measure-${item.key}`}>
                  <span
                    ref={(node) => {
                      if (node) itemMeasureRefs.current.set(item.key, node);
                      else itemMeasureRefs.current.delete(item.key);
                    }}
                    className={styles.measureProbe}
                  >
                    <NavItemControl item={item} />
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
            className={[styles.linkList, isHeaderCollapsed && styles.linkListMobile]
              .filter(Boolean)
              .join(" ")}
          >
            <li className={styles.brandCell}>{brandNode}</li>
            <li className={styles.menuCell}>
              {isHeaderCollapsed ? (
                <ul className={styles.menuList}>
                  {isDashboardCompactBar
                    ? mobilePinned.map((item) => (
                        <li key={item.key}>
                          <NavItemControl item={item} />
                        </li>
                      ))
                    : null}
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
                </ul>
              ) : (
                <ul className={styles.menuList}>
                  {visibleItems.map((item) => (
                    <li key={item.key}>
                      <NavItemControl item={item} />
                    </li>
                  ))}
                  {showMore ? (
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
                          {overflowItems.map((item) => (
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
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {isHeaderCollapsed ? (
        <SiteHeaderDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant={brand}
          onAccountClick={onAccountClick}
        />
      ) : null}
    </header>
  );
}
