"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { IconClose, IconSearch } from "@/components/icons/DashboardIcons";
import { t } from "@/lib/i18n/t";
import styles from "./SearchModal.module.scss";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Desktop: under top-right utilities. Menu: under slide-out panel header. */
  placement?: "desktop" | "menu";
};

export function SearchModal({ open, onClose, placement = "menu" }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled"),
      );

    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
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
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label={t("search.close")}
        onClick={handleClose}
      />
      <div
        id={dialogId}
        ref={panelRef}
        className={[
          styles.panel,
          placement === "desktop" ? styles.panelDesktop : styles.panelMenu,
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {t("search.title")}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            aria-label={t("search.close")}
            onClick={handleClose}
          >
            <IconClose />
          </button>
        </div>
        <label className={styles.field}>
          <span className={styles.fieldIcon} aria-hidden="true">
            <IconSearch />
          </span>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder={t("search.placeholder")}
            autoComplete="off"
          />
        </label>
      </div>
    </>
  );
}
