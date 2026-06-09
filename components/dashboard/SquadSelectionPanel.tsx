"use client";

import { useCallback, useId, useState, type RefObject } from "react";
import Image from "next/image";
import { PositionPlayerPicker } from "@/components/dashboard/PositionPlayerPicker";
import { SquadSelectionListView } from "@/components/dashboard/SquadSelectionListView";
import { SquadPitchSlot } from "@/components/dashboard/SquadPitchSlot";
import { IconClose } from "@/components/icons/DashboardIcons";
import { squadPitchFormation, type SquadPositionCode } from "@/data/squad-pitch-formation";
import type { SquadPlayerPoolEntry } from "@/data/squad-player-pool";
import {
  findNextEmptySlotId,
  findRosterSlotIdForPlayer,
  isPlayerOnRoster,
} from "@/lib/squad-roster-slots";
import { useRoster } from "@/lib/roster/RosterProvider";
import { ROSTER_LIST_ONLY_MAX_WIDTH_PX, mediaMaxWidthQuery } from "@/lib/media";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { formatInteger } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";
import styles from "./SquadSelectionPanel.module.scss";

const MAX_SQUAD_PLAYERS = 15;
const SIDE_BY_SIDE_QUERY = "(min-width: 901px)";
const LIST_ONLY_QUERY = mediaMaxWidthQuery(ROSTER_LIST_ONLY_MAX_WIDTH_PX);

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

export type SquadSelectionPanelVariant = "modal" | "embedded";

type Props = {
  managerName: string;
  variant?: SquadSelectionPanelVariant;
  onClose?: () => void;
  className?: string;
  titleId?: string;
  descriptionId?: string;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export function SquadSelectionPanel({
  managerName,
  variant = "embedded",
  onClose,
  className,
  titleId: titleIdProp,
  descriptionId: descriptionIdProp,
  closeButtonRef,
}: Props) {
  const generatedTitleId = useId();
  const generatedDescriptionId = useId();
  const titleId = titleIdProp ?? generatedTitleId;
  const descriptionId = descriptionIdProp ?? generatedDescriptionId;
  const panelId = useId();
  const isSideBySide = useMediaQuery(SIDE_BY_SIDE_QUERY);
  const isListOnlyViewport = useMediaQuery(LIST_ONLY_QUERY);
  const [view, setView] = useState<ViewMode>("pitch");
  const activeView: ViewMode = isListOnlyViewport ? "list" : view;
  const showViewToggle = !isListOnlyViewport;
  const [focusedSlotId, setFocusedSlotId] = useState<string | null>(null);
  const [pickerOverlayOpen, setPickerOverlayOpen] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<SquadPositionCode[]>([]);
  const [teamCodeFilter, setTeamCodeFilter] = useState<string[]>([]);
  const { rosterBySlot, rosterCount, setPlayerForSlot, removePlayerFromSlot } = useRoster();
  const tallyTone = getTallyCountTone(rosterCount);
  const isModal = variant === "modal";
  const showSidebarPicker = isSideBySide;
  const showOverlayPicker = !showSidebarPicker && pickerOverlayOpen;
  const showDesktopColumns = showSidebarPicker;

  const closeOverlayPicker = useCallback(() => {
    setPickerOverlayOpen(false);
    setFocusedSlotId(null);
  }, []);

  const handleAddPlayer = useCallback(
    (player: SquadPlayerPoolEntry) => {
      if (isPlayerOnRoster(rosterBySlot, player.id)) return;

      let slotId = focusedSlotId;
      if (slotId) {
        const slot = squadPitchFormation.find((entry) => entry.id === slotId);
        if (!slot || slot.position !== player.position) {
          slotId = null;
        }
      }

      if (!slotId) {
        slotId = findNextEmptySlotId(rosterBySlot, player.position);
      }

      if (!slotId) return;

      setPlayerForSlot(slotId, player);
      setFocusedSlotId(null);
      if (!showSidebarPicker) {
        setPickerOverlayOpen(false);
      }
    },
    [focusedSlotId, rosterBySlot, setPlayerForSlot, showSidebarPicker],
  );

  const handleSlotSelect = useCallback(
    (slot: (typeof squadPitchFormation)[number]) => {
      setFocusedSlotId(slot.id);
      setPositionFilter([slot.position]);
      if (!showSidebarPicker) {
        setPickerOverlayOpen(true);
      }
    },
    [showSidebarPicker],
  );

  const handleSlotClear = useCallback(
    (slot: (typeof squadPitchFormation)[number]) => {
      removePlayerFromSlot(slot.id);
      if (focusedSlotId === slot.id) {
        setFocusedSlotId(null);
        if (!showSidebarPicker) {
          setPickerOverlayOpen(false);
        }
      }
    },
    [focusedSlotId, removePlayerFromSlot, showSidebarPicker],
  );

  const handleRemovePlayer = useCallback(
    (player: SquadPlayerPoolEntry) => {
      const slotId = findRosterSlotIdForPlayer(rosterBySlot, player.id);
      if (!slotId) return;

      removePlayerFromSlot(slotId);
      if (focusedSlotId === slotId) {
        setFocusedSlotId(null);
        if (!showSidebarPicker) {
          setPickerOverlayOpen(false);
        }
      }
    },
    [focusedSlotId, removePlayerFromSlot, rosterBySlot, showSidebarPicker],
  );

  const pickerProps = {
    searchQuery: playerSearchQuery,
    onSearchQueryChange: setPlayerSearchQuery,
    positionFilter,
    teamCodeFilter,
    onPositionFilterChange: setPositionFilter,
    onTeamCodeFilterChange: setTeamCodeFilter,
    onAddPlayer: handleAddPlayer,
    onRemovePlayer: handleRemovePlayer,
    isPlayerOnRoster: (player: SquadPlayerPoolEntry) => isPlayerOnRoster(rosterBySlot, player.id),
  };

  const rootClass = [
    styles.panel,
    isModal ? styles.panelModal : styles.panelEmbedded,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {isModal && onClose ? (
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeBtn}
          aria-label={t("squadSelection.close")}
          onClick={onClose}
        >
          <IconClose />
        </button>
      ) : null}

      <div
        className={showDesktopColumns ? styles.desktopColumns : undefined}
        data-view={view}
      >
        <div className={showDesktopColumns ? styles.desktopSidebar : undefined}>
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
                selected: rosterCount,
                max: MAX_SQUAD_PLAYERS,
              })}
            >
              <span className={styles.tallyInner}>
                <span
                  className={[styles.tallyCount, tallyCountToneClass[tallyTone]]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {formatInteger(rosterCount)} / {formatInteger(MAX_SQUAD_PLAYERS)}
                </span>
                <span className={styles.tallyLabel}>{t("squadSelection.playersSelected")}</span>
              </span>
            </div>
          </div>

          {showSidebarPicker ? (
            <div className={styles.playerSelectionCol}>
              <PositionPlayerPicker layout="sidebar" {...pickerProps} />
            </div>
          ) : null}
        </div>

        <div className={showDesktopColumns ? styles.desktopMain : undefined}>
          {showViewToggle ? (
            <div
              className={styles.viewToggle}
              role="tablist"
              aria-label={t("squadSelection.viewToggleLabel")}
            >
              <button
                type="button"
                role="tab"
                id={`${panelId}-tab-pitch`}
                aria-selected={activeView === "pitch"}
                aria-controls={`${panelId}-panel-pitch`}
                className={activeView === "pitch" ? styles.viewTabActive : styles.viewTab}
                onClick={() => {
                  closeOverlayPicker();
                  setView("pitch");
                }}
              >
                {t("squadSelection.pitchView")}
              </button>
              <button
                type="button"
                role="tab"
                id={`${panelId}-tab-list`}
                aria-selected={activeView === "list"}
                aria-controls={`${panelId}-panel-list`}
                className={activeView === "list" ? styles.viewTabActive : styles.viewTab}
                onClick={() => {
                  closeOverlayPicker();
                  setView("list");
                }}
              >
                {t("squadSelection.listView")}
              </button>
            </div>
          ) : null}

          <div className={styles.viewBody}>
            {activeView === "pitch" ? (
              <div
                id={`${panelId}-panel-pitch`}
                role="tabpanel"
                aria-labelledby={`${panelId}-tab-pitch`}
                className={[
                  styles.pitchWorkspace,
                  showSidebarPicker ? styles.pitchWorkspaceSideBySide : styles.pitchWorkspaceStacked,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <figure aria-label={t("squadSelection.pitchAlt")} className={styles.pitchPanel}>
                  <div className={styles.pitchStage}>
                    <div className={styles.pitchFrame}>
                      <Image
                        src="/SoccerPitchSqDrk.png"
                        alt=""
                        fill
                        className={styles.pitchImage}
                        sizes="(max-width: 900px) 100vw, 42rem"
                        priority={!isModal}
                        aria-hidden
                      />
                      <div className={styles.pitchAnchor}>
                        <div className={styles.pitchSlots}>
                          {squadPitchFormation.map((slot) => (
                            <SquadPitchSlot
                              key={slot.id}
                              slot={slot}
                              selectedPlayer={rosterBySlot[slot.id]}
                              onSelect={handleSlotSelect}
                              onClear={handleSlotClear}
                            />
                          ))}
                        </div>
                        {showOverlayPicker ? (
                          <PositionPlayerPicker
                            layout="overlay"
                            showClose
                            onClose={closeOverlayPicker}
                            {...pickerProps}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </figure>
              </div>
            ) : (
              <div
                id={`${panelId}-panel-list`}
                role={showViewToggle ? "tabpanel" : undefined}
                aria-labelledby={showViewToggle ? `${panelId}-tab-list` : undefined}
                className={styles.listPanel}
              >
                <div
                  className={[
                    styles.listWorkspace,
                    showSidebarPicker ? styles.listWorkspaceSideBySide : styles.listWorkspaceStacked,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className={styles.listViewCol}>
                    <SquadSelectionListView
                      rosterBySlot={rosterBySlot}
                      onSlotSelect={handleSlotSelect}
                      onSlotClear={handleSlotClear}
                      className={styles.listView}
                    />
                    {showOverlayPicker ? (
                      <PositionPlayerPicker
                        layout="overlay"
                        showClose
                        onClose={closeOverlayPicker}
                        {...pickerProps}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
