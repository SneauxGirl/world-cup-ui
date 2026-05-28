"use client";

import { useId, useState } from "react";
import {
  IconApple,
  IconEye,
  IconEyeOff,
  IconFacebook,
  IconGoogle,
} from "@/components/auth/AuthIcons";
import { t } from "@/lib/i18n/t";
import styles from "./LoginForm.module.scss";

function DeadLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className={styles.deadLink}
      aria-disabled="true"
      tabIndex={-1}
      onClick={(event) => event.preventDefault()}
    >
      {children}
    </a>
  );
}

type Props = {
  className?: string;
};

export function LoginForm({ className }: Props = {}) {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={[styles.loginCard, className].filter(Boolean).join(" ")}>
      <h1 className={styles.title}>
        {t("login.titleLine1")}
        <br />
        {t("login.titleLine2")}
      </h1>

      <form className={styles.form} action="/dashboard" method="get">
        <div className={styles.field}>
          <label className={styles.label} htmlFor={emailId}>
            {t("login.emailLabel")}
          </label>
          <div className={styles.chamferTrim}>
            <div className={styles.fieldInner}>
              <input
                id={emailId}
                className={styles.chamferInput}
                type="email"
                name="email"
                autoComplete="email"
                placeholder={t("login.emailPlaceholder")}
                defaultValue={t("login.emailPlaceholder")}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={passwordId}>
            {t("login.passwordLabel")}
          </label>
          <div className={styles.chamferTrim}>
            <div className={styles.passwordInner}>
              <input
                id={passwordId}
                className={styles.chamferInput}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder={t("login.passwordPlaceholder")}
                defaultValue={t("login.passwordPlaceholder")}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={
                  showPassword ? t("login.hidePassword") : t("login.showPassword")
                }
                onClick={() => setShowPassword((open) => !open)}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.chamferTrim}>
          <button type="submit" className={[styles.chamferBtn, styles.signInBtn].join(" ")}>
            {t("login.signIn")}
          </button>
        </div>
      </form>

      <p className={styles.or}>{t("login.or")}</p>

      <div className={styles.social}>
        <div className={styles.chamferTrim}>
          <button type="button" className={[styles.chamferBtn, styles.socialBtn].join(" ")}>
            <IconGoogle />
            <span>{t("login.signInGoogle")}</span>
          </button>
        </div>
        <div className={styles.chamferTrim}>
          <button type="button" className={[styles.chamferBtn, styles.socialBtn].join(" ")}>
            <IconFacebook />
            <span>{t("login.signInFacebook")}</span>
          </button>
        </div>
        <div className={styles.chamferTrim}>
          <button type="button" className={[styles.chamferBtn, styles.socialBtn].join(" ")}>
            <IconApple />
            <span>{t("login.signInApple")}</span>
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          {t("login.noAccount")} <DeadLink>{t("login.joinNow")}</DeadLink>
        </p>
        <p>
          <DeadLink>{t("login.resetPassword")}</DeadLink>
        </p>
        <p>
          <DeadLink>{t("login.returningUserSupport")}</DeadLink>
        </p>
      </footer>
    </div>
  );
}

