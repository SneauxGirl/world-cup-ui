"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import type { User } from "firebase/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ComponentType } from "react";
import {
  IconClose,
  IconLock,
  IconMail,
} from "@/components/icons/DashboardIcons";
import { GitHubInvertocatIcon } from "@/components/icons/GitHubInvertocatIcon";
import { GitHubOctocatIcon } from "@/components/icons/GitHubOctocatIcon";
import { LinkedInLogoIcon } from "@/components/icons/LinkedInLogoIcon";
import { accountPortalDesigner } from "@/data/account-portal-designer";
import { userDashboard } from "@/data/dashboard-seed";
import type { UserAvatarKey } from "@/data/types";
import { ACCOUNT_PORTAL_DESIGNER_VISIBLE } from "@/lib/appearance/appearance";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { t } from "@/lib/i18n/t";
import styles from "./UserAccountPortal.module.scss";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function userHasMfa(user: User | null): boolean {
  const enrolled = (
    user as User & { multiFactor?: { enrolledFactors?: readonly unknown[] } }
  )?.multiFactor?.enrolledFactors;
  return (enrolled?.length ?? 0) > 0;
}

export const USER_ACCOUNT_PORTAL_ID = "user-account-portal";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogout?: () => void;
};

type DesignerLinkIconProps = {
  className?: string;
};

type DesignerLinkItem = {
  key: string;
  href: string;
  ariaLabel: string;
  Icon: ComponentType<DesignerLinkIconProps>;
  iconClassName: string;
  external: boolean;
};

function AvatarIcon({ avatar }: { avatar: UserAvatarKey }) {
  if (avatar === "octocat") {
    return (
      <span className={styles.avatarOctocat}>
        <GitHubOctocatIcon width={36} height={36} />
      </span>
    );
  }
  return null;
}

function AccountPortalDesignerSection() {
  const sectionId = useId();

  const items = useMemo(() => {
    const resolvedEmail = accountPortalDesigner.emailAddress.trim();
    const links: DesignerLinkItem[] = [];

    if (accountPortalDesigner.linkedinUrl.trim()) {
      links.push({
        key: "linkedin",
        href: accountPortalDesigner.linkedinUrl.trim(),
        ariaLabel: t("accountPortal.designerLinkedinOpens"),
        Icon: LinkedInLogoIcon,
        iconClassName: `${styles.designerLinkIconBrand} ${styles.designerLinkIconLinkedin}`,
        external: true,
      });
    }

    if (accountPortalDesigner.githubUrl.trim()) {
      links.push({
        key: "github",
        href: accountPortalDesigner.githubUrl.trim(),
        ariaLabel: t("accountPortal.designerGithubOpens"),
        Icon: GitHubInvertocatIcon,
        iconClassName: `${styles.designerLinkIconBrand} ${styles.designerLinkIconGithub}`,
        external: true,
      });
    }

    if (resolvedEmail) {
      links.push({
        key: "email",
        href: `mailto:${resolvedEmail}`,
        ariaLabel: t("accountPortal.designerEmailOpens"),
        Icon: IconMail,
        iconClassName: styles.designerLinkIcon,
        external: false,
      });
    }

    return links;
  }, []);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby={sectionId}>
      <h3 id={sectionId} className={styles.sectionTitle}>
        {t("accountPortal.designerInfo")}
      </h3>
      <div className={styles.designerRow} role="list">
        {items.map(({ key, href, ariaLabel, Icon, iconClassName, external }) => (
          <div key={key} className={styles.designerTrim} role="listitem">
            <a
              className={styles.designerLink}
              href={href}
              aria-label={ariaLabel}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Icon className={iconClassName} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UserAccountPortal({ open, onClose, onLogout }: Props) {
  const { user } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const displayName = user?.displayName?.trim() || userDashboard.displayName;
  const hasMfa = userHasMfa(user);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
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

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
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
  }, [open, onClose]);

  const handleLogout = useCallback(() => {
    onClose();
    onLogout?.();
  }, [onClose, onLogout]);

  if (!open) return null;

  const dialog = (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label={t("accountPortal.close")}
        onClick={onClose}
      />
      <div
        id={USER_ACCOUNT_PORTAL_ID}
        ref={panelRef}
        className={styles.panelShell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.panel}>
          <div className={styles.profileHead}>
            <div className={styles.profileMain}>
              <span className={styles.avatarFrame} aria-hidden="true">
                <AvatarIcon avatar={userDashboard.avatar} />
              </span>
              <div className={styles.profileCopy}>
                <h2 id={titleId} className={styles.displayName}>
                  {displayName}
                </h2>
                <button type="button" className={styles.settingsLink} onClick={onClose}>
                  {t("accountPortal.loginSettings")}
                </button>
                {hasMfa ? (
                  <p className={styles.securityStatus}>
                    <IconLock className={styles.securityIcon} aria-hidden="true" />
                    {t("accountPortal.twoStepActive")}
                  </p>
                ) : null}
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label={t("accountPortal.close")}
              onClick={onClose}
            >
              <IconClose />
            </button>
          </div>

          {ACCOUNT_PORTAL_DESIGNER_VISIBLE ? <AccountPortalDesignerSection /> : null}

          <section className={styles.section}>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              {t("accountPortal.logout")}
            </button>
          </section>
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(dialog, document.body);
}
