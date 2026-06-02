"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { IconSearch, IconUser } from "@/components/icons/DashboardIcons";
import { GitHubOctocatIcon } from "@/components/icons/GitHubOctocatIcon";
import { SearchModal } from "@/components/shared/SearchModal";
import navStyles from "@/components/shared/SiteNavMenu.module.scss";
import { UserAccountPortal, USER_ACCOUNT_PORTAL_ID } from "@/components/shared/UserAccountPortal";
import { userDashboard } from "@/data/dashboard-seed";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import styles from "./SiteUtilities.module.scss";

type UseSiteUtilitiesOptions = {
  className?: string;
  /** Called when the user chooses Log out from the account portal. */
  onLogout?: () => void;
  /** When false, search is shown at the top of the mobile header drawer instead. */
  showSearchInHeader?: boolean;
};

function DrawerInlineSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const commitSearch = useCallback(() => {
    const input = inputRef.current;
    if (!input?.value.trim()) return;

    input.blur();
    committedRef.current = true;
    setCommitted(true);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      commitSearch();
    },
    [commitSearch],
  );

  const handleInputFocus = useCallback(() => {
    if (!committedRef.current) return;
    committedRef.current = false;
    setCommitted(false);
  }, []);

  return (
    <div className={navStyles.menuSearchRow}>
      <form className={styles.drawerSearchForm} onSubmit={handleSubmit}>
        <label
          className={[
            styles.drawerSearchField,
            committed && styles.drawerSearchFieldCommitted,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <IconSearch className={styles.drawerSearchIcon} aria-hidden />
          <span className={styles.drawerSearchLabel}>{t("footer.search")}</span>
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            className={styles.drawerSearchInput}
            placeholder={t("search.placeholder")}
            aria-label={t("footer.search")}
            autoComplete="off"
            enterKeyHint="search"
            onFocus={handleInputFocus}
          />
        </label>
      </form>
    </div>
  );
}

export function useSiteUtilities({
  className,
  onLogout,
  showSearchInHeader = true,
}: UseSiteUtilitiesOptions = {}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const rootClass = [styles.utilities, className].filter(Boolean).join(" ");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closePortal = useCallback(() => setPortalOpen(false), []);
  const togglePortal = useCallback(() => setPortalOpen((open) => !open), []);

  useEffect(() => {
    if (!searchOpen || !showSearchInHeader) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [searchOpen, showSearchInHeader]);

  const headerUtilities = (
    <div className={rootClass} role="group" aria-label={t("footer.utilitiesLabel")}>
      {showSearchInHeader ? (
        <button
          type="button"
          className={styles.utilityBtn}
          aria-label={t("footer.search")}
          onClick={openSearch}
        >
          <IconSearch />
        </button>
      ) : null}
      <button
        type="button"
        className={[styles.utilityBtn, styles.utilityBtnAccount].join(" ")}
        aria-label={t("auth.accountMenu")}
        aria-haspopup="dialog"
        aria-expanded={portalOpen}
        aria-controls={portalOpen ? USER_ACCOUNT_PORTAL_ID : undefined}
        onClick={togglePortal}
      >
        {userDashboard.avatar === "octocat" ? <GitHubOctocatIcon width={24} height={24} /> : <IconUser />}
      </button>
    </div>
  );

  const DrawerSearch: ComponentType = DrawerInlineSearch;

  const overlays = (
    <>
      <UserAccountPortal open={portalOpen} onClose={closePortal} onLogout={onLogout} />
      {showSearchInHeader ? (
        <SearchModal open={searchOpen} onClose={closeSearch} placement="desktop" />
      ) : null}
    </>
  );

  return { headerUtilities, overlays, DrawerSearch };
}

type Props = UseSiteUtilitiesOptions;

/** Dashboard header bar: search and account beside nav controls. */
export function SiteUtilities(props: Props) {
  const { headerUtilities, overlays } = useSiteUtilities(props);
  return (
    <>
      {headerUtilities}
      {overlays}
    </>
  );
}
