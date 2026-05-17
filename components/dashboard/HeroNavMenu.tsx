"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IconClose, IconMenu } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import navStyles from "./Navigation.module.scss";

const menuItems = [
  { key: "dashboard" as const, href: "/" },
  { key: "roster" as const, href: "/" },
  { key: "matches" as const, href: "/" },
  { key: "standings" as const, href: "/" },
  { key: "players" as const, href: "/" },
  { key: "tournament" as const, href: "/" },
  { key: "store" as const, href: "/" },
  { key: "settings" as const, href: "/" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function HeroNavMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const menuId = useId();

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () => {
      const nodes: HTMLElement[] = [];
      if (menuBtnRef.current) nodes.push(menuBtnRef.current);
      if (overlayRef.current) nodes.push(overlayRef.current);
      nodes.push(...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)));
      return nodes.filter((el) => !el.hasAttribute("disabled"));
    };

    getFocusable()[0]?.focus();
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (open) return;
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
          <div
            id={menuId}
            ref={panelRef}
            className={navStyles.menuPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <h2 id={titleId} className={navStyles.srOnly}>
              {t("nav.menuDialogLabel")}
            </h2>
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
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
