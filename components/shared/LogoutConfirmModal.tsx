"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { t } from "@/lib/i18n/t";
import styles from "./LogoutConfirmModal.module.scss";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Placement = "centered" | "anchored";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  placement?: Placement;
  anchorRef?: RefObject<HTMLElement | null>;
};

export function LogoutConfirmModal({
  open,
  onCancel,
  onConfirm,
  placement = "centered",
  anchorRef,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();
  const [anchorStyle, setAnchorStyle] = useState<{
    bottom: number;
    left: number;
    width: number;
  } | null>(null);

  const isAnchored = placement === "anchored" && anchorRef != null;
  const handleCancel = useCallback(() => onCancel(), [onCancel]);

  const updateAnchorPosition = useCallback(() => {
    const anchor = anchorRef?.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    setAnchorStyle({
      left: rect.left,
      width: rect.width,
      bottom: window.innerHeight - rect.top + gap,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!open || !isAnchored) {
      setAnchorStyle(null);
      return;
    }

    updateAnchorPosition();

    window.addEventListener("resize", updateAnchorPosition);
    window.addEventListener("scroll", updateAnchorPosition, true);
    return () => {
      window.removeEventListener("resize", updateAnchorPosition);
      window.removeEventListener("scroll", updateAnchorPosition, true);
    };
  }, [open, isAnchored, updateAnchorPosition]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled"),
      );

    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
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
  }, [open, handleCancel]);

  useEffect(() => {
    if (!open || !isAnchored) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      handleCancel();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, isAnchored, handleCancel, anchorRef]);

  if (!open) return null;

  const panelShellClass = [
    styles.panelShell,
    isAnchored ? styles.panelAnchored : styles.panelCentered,
  ].join(" ");

  const panelStyle = isAnchored && anchorStyle
    ? {
        left: anchorStyle.left,
        width: anchorStyle.width,
        bottom: anchorStyle.bottom,
      }
    : undefined;

  const dialog = (
    <>
      {!isAnchored ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label={t("auth.cancel")}
          onClick={handleCancel}
        />
      ) : null}
      <div
        id={dialogId}
        ref={panelRef}
        className={panelShellClass}
        style={panelStyle}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.panel}>
          <p id={titleId} className={styles.title}>
            {t("auth.logoutTitle")}
          </p>
          <div className={styles.actions}>
            <div className={styles.chamferTrim}>
              <button
                ref={cancelRef}
                type="button"
                className={[styles.chamferBtn, styles.cancelBtn].join(" ")}
                onClick={handleCancel}
              >
                {t("auth.cancel")}
              </button>
            </div>
            <div className={styles.chamferTrim}>
              <button
                type="button"
                className={[styles.chamferBtn, styles.confirmBtn].join(" ")}
                onClick={onConfirm}
              >
                {t("auth.confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isAnchored && typeof document !== "undefined") {
    return createPortal(dialog, document.body);
  }

  return dialog;
}
