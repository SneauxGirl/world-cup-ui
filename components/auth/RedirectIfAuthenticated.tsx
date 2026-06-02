"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { t } from "@/lib/i18n/t";
import styles from "./RequireAuth.module.scss";

type Props = {
  children: ReactNode;
};

/** Public routes only — sends signed-in users to the dashboard. */
export function RedirectIfAuthenticated({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className={styles.screen} role="status" aria-live="polite">
        <p className={styles.message}>{t("auth.loading")}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.screen} role="status" aria-live="polite">
        <p className={styles.message}>{t("auth.redirecting")}</p>
      </div>
    );
  }

  return children;
}
