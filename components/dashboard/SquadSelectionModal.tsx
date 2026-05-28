"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { SquadPitchSlot } from "@/components/dashboard/SquadPitchSlot";
import { IconClose } from "@/components/icons/DashboardIcons";
import { squadPitchFormation } from "@/data/squad-pitch-formation";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./SquadSelectionModal.module.scss";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MAX_SQUAD_PLAYERS = 15;

type TallyCountTone = "empty" | "building" | "full";

function getTallyCountTone(selectedCount: number): TallyCountTone {
  const count = Math.max(0, Math.min(MAX_SQUAD_PLAYERS, selectedCount));
  if (count === 0) return "empty";
  if (count <= 10) return "building";
  return "full";
}

const tallyCountToneClass: Record<TallyCountTone, string> = {
  empty: styles.tallyCountEmpty,
  building: styles.tallyCountBuilding,
  full: styles.tallyCountFull,
};

type ViewMode = "pitch" | "list";

type Props = {
  open: boolean;
  onClose: () => void;
  managerName: string;
  /** Mock: selected squad count until selection logic exists. */
  selectedCount?: number;
};

export function SquadSelectionModal({
  open,
  onClose,
  managerName,
  selectedCount = 0,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const dialogId = useId();
  const [view, setView] = useState<ViewMode>("pitch");
  const tallyTone = getTallyCountTone(selectedCount);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    setView("pitch");
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
      <div
        className={styles.overlay}
        role="presentation"
        onClick={handleClose}
      />
      <div
        id={dialogId}
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className={styles.panel}>
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            aria-label={t("squadSelection.close")}
            onClick={handleClose}
          >
            <IconClose />
          </button>

          <header className={styles.header}>
            <h1 id={titleId} className={styles.title}>
              {t("squadSelection.title")}
            </h1>
            <p id={descriptionId} className={styles.description}>
              {t("squadSelection.description")}
            </p>
          </header>

          <div className={styles.metaRow}>
            <div className={styles.managerBlock}>
              <span className={styles.managerLabel}>{t("dashboard.eliteManager")}</span>
              <span className={styles.managerName}>{managerName}</span>
            </div>
            <div
              className={styles.selectionTally}
              aria-label={t("squadSelection.playersSelectedTally", {
                selected: selectedCount,
                max: MAX_SQUAD_PLAYERS,
              })}
            >
              <span className={styles.tallyInner}>
                <span
                  className={[styles.tallyCount, tallyCountToneClass[tallyTone]]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {formatInteger(selectedCount)} / {formatInteger(MAX_SQUAD_PLAYERS)}
                </span>
                <span className={styles.tallyLabel}>{t("squadSelection.playersSelected")}</span>
              </span>
            </div>
          </div>

          <div
            className={styles.viewToggle}
            role="tablist"
            aria-label={t("squadSelection.viewToggleLabel")}
          >
            <button
              type="button"
              role="tab"
              id={`${dialogId}-tab-pitch`}
              aria-selected={view === "pitch"}
              aria-controls={`${dialogId}-panel-pitch`}
              className={view === "pitch" ? styles.viewTabActive : styles.viewTab}
              onClick={() => setView("pitch")}
            >
              {t("squadSelection.pitchView")}
            </button>
            <button
              type="button"
              role="tab"
              id={`${dialogId}-tab-list`}
              aria-selected={view === "list"}
              aria-controls={`${dialogId}-panel-list`}
              className={view === "list" ? styles.viewTabActive : styles.viewTab}
              onClick={() => setView("list")}
            >
              {t("squadSelection.listView")}
            </button>
          </div>

          <div className={styles.viewBody}>
            {view === "pitch" ? (
              <figure
                id={`${dialogId}-panel-pitch`}
                role="tabpanel"
                aria-labelledby={`${dialogId}-tab-pitch`}
                aria-label={t("squadSelection.pitchAlt")}
                className={styles.pitchPanel}
              >
                <div className={styles.pitchStage}>
                  <div className={styles.pitchFrame}>
                    <Image
                      src="/SoccerPitchSqDrk.png"
                      alt=""
                      fill
                      className={styles.pitchImage}
                      sizes="(max-width: 768px) 100vw, 42rem"
                      priority
                      aria-hidden
                    />
                    <div className={styles.pitchAnchor}>
                      <div className={styles.pitchSlots}>
                        {squadPitchFormation.map((slot) => (
                          <SquadPitchSlot key={slot.id} slot={slot} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            ) : (
              <div
                id={`${dialogId}-panel-list`}
                role="tabpanel"
                aria-labelledby={`${dialogId}-tab-list`}
                className={styles.listPanel}
              >
                <p className={styles.listPlaceholder}>{t("squadSelection.listPlaceholder")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
