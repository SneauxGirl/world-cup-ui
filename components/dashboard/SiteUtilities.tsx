"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconSearch, IconUser } from "@/components/icons/DashboardIcons";
import { SearchModal } from "@/components/shared/SearchModal";
import { UserAccountPortal, USER_ACCOUNT_PORTAL_ID } from "@/components/shared/UserAccountPortal";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import styles from "./SiteUtilities.module.scss";

type Props = {
  className?: string;
  /** Called when the user chooses Log out from the account portal. */
  onLogout?: () => void;
};

/** Desktop shell top-right: search and account only. */
export function SiteUtilities({ className, onLogout }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const accountBtnRef = useRef<HTMLButtonElement>(null);
  const rootClass = [styles.utilities, className].filter(Boolean).join(" ");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closePortal = useCallback(() => setPortalOpen(false), []);
  const togglePortal = useCallback(() => setPortalOpen((open) => !open), []);

  useEffect(() => {
    if (!searchOpen) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [searchOpen]);

  return (
    <>
      <div className={rootClass} role="group" aria-label={t("footer.utilitiesLabel")}>
        <button
          type="button"
          className={styles.utilityBtn}
          aria-label={t("footer.search")}
          onClick={openSearch}
        >
          <IconSearch />
        </button>
        <button
          ref={accountBtnRef}
          type="button"
          className={[styles.utilityBtn, styles.utilityBtnAccount].join(" ")}
          aria-label={t("auth.accountMenu")}
          aria-haspopup="dialog"
          aria-expanded={portalOpen}
          aria-controls={portalOpen ? USER_ACCOUNT_PORTAL_ID : undefined}
          onClick={togglePortal}
        >
          <IconUser />
        </button>
      </div>
      <UserAccountPortal
        open={portalOpen}
        onClose={closePortal}
        onLogout={onLogout}
        anchorRef={accountBtnRef}
      />
      <SearchModal open={searchOpen} onClose={closeSearch} placement="desktop" />
    </>
  );
}
