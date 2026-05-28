"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  const inputId = useId();
  const dialogId = useId();
  const [searchCommitted, setSearchCommitted] = useState(false);
  const searchCommittedRef = useRef(false);

  const handleClose = useCallback(() => onClose(), [onClose]);

  const commitSearch = useCallback(() => {
    const input = inputRef.current;
    if (!input?.value.trim()) return;

    input.blur();
    searchCommittedRef.current = true;
    setSearchCommitted(true);

    requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      commitSearch();
    },
    [commitSearch],
  );

  const handleInputFocus = useCallback(() => {
    if (!searchCommittedRef.current) return;
    searchCommittedRef.current = false;
    setSearchCommitted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    searchCommittedRef.current = false;
    setSearchCommitted(false);
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key === "Tab" && searchCommittedRef.current && !event.shiftKey) {
        const close = closeBtnRef.current;
        if (close && document.activeElement !== close) {
          event.preventDefault();
          close.focus();
          return;
        }
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
      <div
        className={styles.overlay}
        role="presentation"
        onClick={handleClose}
      />
      <div
        id={dialogId}
        ref={panelRef}
        tabIndex={-1}
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
        </div>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <label
            htmlFor={inputId}
            className={[styles.field, searchCommitted && styles.fieldCommitted]
              .filter(Boolean)
              .join(" ")}
          >
            <span className={styles.fieldIcon} aria-hidden="true">
              <IconSearch />
            </span>
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              role="searchbox"
              className={styles.input}
              placeholder={t("search.placeholder")}
              autoComplete="off"
              enterKeyHint="search"
              onFocus={handleInputFocus}
            />
          </label>
        </form>
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
    </>
  );
}
