"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IconChevronDown } from "@/components/icons/DashboardIcons";
import {
  SITE_HEADER_MORE_KEY,
  siteHeaderNavItems,
  type SiteHeaderNavItem,
} from "@/data/site-header-nav";
import { t } from "@/lib/i18n/t";
import styles from "./SiteHeader.module.scss";

const ITEM_GAP_PX = 17.6; /* ~1.1rem — matches .menuList gap */
const TITLE_MENU_GAP_PX = 20; /* ~1.25rem — space-between the two header sides */

type Props = {
  className?: string;
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

export function SiteHeader({ className }: Props) {
  const rootClass = [styles.header, className].filter(Boolean).join(" ");
  const navId = useId();
  const moreMenuId = useId();

  const navRef = useRef<HTMLElement>(null);
  const menuCellRef = useRef<HTMLLIElement>(null);
  const titleRef = useRef<HTMLAnchorElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const itemMeasureRefs = useRef(new Map<string, HTMLSpanElement>());
  const moreWrapRef = useRef<HTMLLIElement>(null);

  const [visibleCount, setVisibleCount] = useState<number>(siteHeaderNavItems.length);
  const [moreOpen, setMoreOpen] = useState(false);

  const overflowItems = siteHeaderNavItems.slice(visibleCount);
  const visibleItems = siteHeaderNavItems.slice(0, visibleCount);
  const showMore = overflowItems.length > 0;

  const measureFit = useCallback(() => {
    const nav = navRef.current;
    const title = titleRef.current;
    const moreProbe = moreMeasureRef.current;
    if (!nav || !title || !moreProbe) return;

    const navRect = nav.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    if (navRect.width <= 0) return;

    const moreWidth = moreProbe.offsetWidth;
    /* Space from title end to nav end — menu cell width is unreliable once items collapse. */
    const available = Math.max(
      0,
      navRect.right - titleRect.right - TITLE_MENU_GAP_PX,
    );

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
  }, []);

  useLayoutEffect(() => {
    measureFit();
  }, [measureFit]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => {
      measureFit();
    });
    const title = titleRef.current;
    observer.observe(nav);
    if (title) observer.observe(title);
    window.addEventListener("resize", measureFit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureFit);
    };
  }, [measureFit]);

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

  return (
    <header className={rootClass}>
      <div className={styles.inner}>
        <nav
          ref={navRef}
          className={styles.siteNav}
          aria-label={t("footer.navLabel")}
        >
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

          <ul id={navId} className={styles.linkList}>
            <li className={styles.brandCell}>
              <Link href="/" className={styles.siteTitle} ref={titleRef}>
                {t("app.worldCupChallenge")}
              </Link>
            </li>
            <li ref={menuCellRef} className={styles.menuCell}>
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
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
