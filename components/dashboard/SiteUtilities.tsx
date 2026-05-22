"use client";

import { useCallback, useEffect, useState } from "react";
import { IconSearch, IconUser } from "@/components/icons/DashboardIcons";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import styles from "./SiteUtilities.module.scss";

type Props = {
  className?: string;
  onAccountClick?: () => void;
};

/** Desktop shell top-right: search and account only. */
export function SiteUtilities({ className, onAccountClick }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const rootClass = [styles.utilities, className].filter(Boolean).join(" ");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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
          type="button"
          className={[styles.utilityBtn, styles.utilityBtnAccount].join(" ")}
          aria-label={t("footer.account")}
          onClick={onAccountClick}
        >
          <IconUser />
        </button>
      </div>
      <SearchModal open={searchOpen} onClose={closeSearch} placement="desktop" />
    </>
  );
}
