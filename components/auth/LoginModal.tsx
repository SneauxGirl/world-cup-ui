"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/icons/DashboardIcons";
import { LoginForm } from "@/components/auth/LoginForm";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import styles from "./LoginModal.module.scss";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LoginModal({ open, onClose }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const shell = shellRef.current;
    if (!shell) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(shell.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled"),
      );

    closeBtnRef.current?.focus();

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

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label={t("login.closeDialog")}
        onClick={handleClose}
      />
      <div
        id={dialogId}
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className={styles.srOnly}>
          {t("login.dialogLabel")}
        </h2>
        <div className={styles.panel}>
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            aria-label={t("login.closeDialog")}
            onClick={handleClose}
          >
            <IconClose />
          </button>
          <div className={styles.formScroll}>
            <LoginForm className={styles.modalForm} />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
