"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/icons/DashboardIcons";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import { en } from "@/messages/en";
import styles from "./ValueTrendInfoModal.module.scss";

type InfoBullet = (typeof en.valueTrends.infoModalBullets)[number];
type ColoredInfoBullet = Extract<InfoBullet, { tone: string }>;

function isColoredBullet(bullet: InfoBullet): bullet is ColoredInfoBullet {
  return typeof bullet !== "string";
}

const LABEL_TONE_CLASS: Record<ColoredInfoBullet["tone"], string> = {
  sky: styles.labelSky,
  red: styles.labelRed,
  teal: styles.labelTeal,
  yellow: styles.labelYellow,
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ValueTrendInfoModal({ open, onClose }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

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
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = Array.from(
        shell.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, handleClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.frame}>
          <div className={styles.panel}>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label={t("valueTrends.closeInfoModal")}
              onClick={handleClose}
            >
              <IconClose />
            </button>
            <h3 id={titleId} className={styles.title}>
              {t("valueTrends.infoModalTitle")}
            </h3>
            <ul id={descriptionId} className={styles.list}>
              {en.valueTrends.infoModalBullets.map((bullet, index) => (
                <li
                  key={
                    isColoredBullet(bullet)
                      ? bullet.label
                      : `plain-${index}`
                  }
                  className={styles.item}
                >
                  {isColoredBullet(bullet) ? (
                    <>
                      <span className={LABEL_TONE_CLASS[bullet.tone]}>
                        {bullet.label}
                      </span>
                      {": "}
                      {bullet.text}
                    </>
                  ) : (
                    bullet
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
