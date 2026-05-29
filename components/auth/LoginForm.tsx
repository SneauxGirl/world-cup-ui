"use client";

import { useId, useState, type ReactNode, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  IconApple,
  IconEye,
  IconEyeOff,
  IconFacebook,
  IconGoogle,
} from "@/components/auth/AuthIcons";
import { getAuthErrorDisplay, type AuthErrorDisplay } from "@/lib/firebase/auth-errors";
import { t } from "@/lib/i18n/t";
import styles from "./LoginForm.module.scss";

function DeadLink({ children }: { children: ReactNode }) {
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

function FooterSwitchLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  if (!onClick) {
    return <DeadLink>{children}</DeadLink>;
  }

  return (
    <button type="button" className={styles.footerLink} onClick={onClick}>
      {children}
    </button>
  );
}

function DeadSocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className={styles.chamferTrim}>
      <button
        type="button"
        className={[styles.chamferBtn, styles.socialBtn, styles.socialBtnDisabled].join(" ")}
        aria-disabled="true"
        tabIndex={-1}
        onClick={(event) => event.preventDefault()}
      >
        {icon}
        <span>{label}</span>
      </button>
    </div>
  );
}

type AuthMode = "signIn" | "signUp";
type Props = {
  className?: string;
  mode?: AuthMode;
  onSuccess?: () => void;
  onRequestSignUp?: () => void;
  onRequestSignIn?: () => void;
};

export function LoginForm({
  className,
  mode = "signIn",
  onSuccess,
  onRequestSignUp,
  onRequestSignIn,
}: Props = {}) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const isSignUp = mode === "signUp";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(isSignUp ? "" : "thechamp@wcui.dev");
  const [password, setPassword] = useState(isSignUp ? "" : "W0r!dCup2o26");
  const [authError, setAuthError] = useState<AuthErrorDisplay | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const firstNameErrorId = useId();
  const lastNameErrorId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const formErrorId = useId();

  const firstNameError = authError?.field === "firstName" ? authError.message : null;
  const lastNameError = authError?.field === "lastName" ? authError.message : null;
  const emailError = authError?.field === "email" ? authError.message : null;
  const passwordError = authError?.field === "password" ? authError.message : null;
  const formError = authError?.field === "form" ? authError.message : null;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError(null);

    if (mode === "signUp") {
      if (!firstName.trim()) {
        setAuthError({ message: t("login.authErrors.missingFirstName"), field: "firstName" });
        return;
      }
      if (!lastName.trim()) {
        setAuthError({ message: t("login.authErrors.missingLastName"), field: "lastName" });
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "signUp") {
        await signUp(email, password, { firstName, lastName });
      } else {
        await signIn(email, password);
      }
      onSuccess?.();
      router.push("/dashboard");
    } catch (err) {
      setAuthError(getAuthErrorDisplay(err, mode));
      if (event.currentTarget instanceof HTMLFormElement) {
        event.currentTarget.querySelector<HTMLButtonElement>('button[type="submit"]')?.blur();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={[styles.loginCard, className].filter(Boolean).join(" ")}>
      <h1 className={styles.title}>
        {isSignUp ? (
          <>
            {t("login.signUpTitleLine1")}
            <br />
            {t("login.signUpTitleLine2")}
          </>
        ) : (
          <>
            {t("login.titleLine1")}
            <br />
            {t("login.titleLine2")}
          </>
        )}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {isSignUp ? (
          <div className={styles.nameRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={firstNameId}>
                {t("login.firstNameLabel")}
              </label>
              <div className={styles.chamferTrim}>
                <div className={styles.fieldInner}>
                  <input
                    id={firstNameId}
                    className={styles.chamferInput}
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder={t("login.firstNamePlaceholder")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={firstNameError ? true : undefined}
                    aria-describedby={firstNameError ? firstNameErrorId : undefined}
                  />
                </div>
              </div>
              {firstNameError ? (
                <p id={firstNameErrorId} className={styles.fieldError} role="alert">
                  {firstNameError}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={lastNameId}>
                {t("login.lastNameLabel")}
              </label>
              <div className={styles.chamferTrim}>
                <div className={styles.fieldInner}>
                  <input
                    id={lastNameId}
                    className={styles.chamferInput}
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder={t("login.lastNamePlaceholder")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-invalid={lastNameError ? true : undefined}
                    aria-describedby={lastNameError ? lastNameErrorId : undefined}
                  />
                </div>
              </div>
              {lastNameError ? (
                <p id={lastNameErrorId} className={styles.fieldError} role="alert">
                  {lastNameError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? emailErrorId : undefined}
              />
            </div>
          </div>
          {emailError ? (
            <p id={emailErrorId} className={styles.fieldError} role="alert">
              {emailError}
            </p>
          ) : null}
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
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={passwordError ? true : undefined}
                aria-describedby={passwordError ? passwordErrorId : undefined}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={
                  showPassword ? t("login.hidePassword") : t("login.showPassword")}
                onClick={() => setShowPassword((open) => !open)}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          {passwordError ? (
            <p id={passwordErrorId} className={styles.fieldError} role="alert">
              {passwordError}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p id={formErrorId} className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <div className={styles.chamferTrim}>
          <button
            type="submit"
            className={[
              styles.chamferBtn,
              isSignUp ? styles.signUpBtn : styles.signInBtn,
              submitting && (isSignUp ? styles.signUpBtnBusy : styles.signInBtnBusy),
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting
              ? isSignUp
                ? t("login.signingUp")
                : t("login.signingIn")
              : isSignUp
                ? t("login.signUp")
                : t("login.signIn")}
          </button>
        </div>
      </form>

      <p className={styles.or}>{t("login.or")}</p>

      <div className={styles.social}>
        <DeadSocialButton
          icon={<IconGoogle />}
          label={isSignUp ? t("login.signUpGoogle") : t("login.signInGoogle")}
        />
        <DeadSocialButton
          icon={<IconFacebook />}
          label={isSignUp ? t("login.signUpFacebook") : t("login.signInFacebook")}
        />
        <DeadSocialButton
          icon={<IconApple />}
          label={isSignUp ? t("login.signUpApple") : t("login.signInApple")}
        />
      </div>

      <footer className={styles.footer}>
        {isSignUp ? (
          <p>
            {t("login.hasAccount")}{" "}
            <FooterSwitchLink onClick={onRequestSignIn}>{t("login.signInInstead")}</FooterSwitchLink>
          </p>
        ) : (
          <p>
            {t("login.noAccount")}{" "}
            <FooterSwitchLink onClick={onRequestSignUp}>{t("login.joinNow")}</FooterSwitchLink>
          </p>
        )}
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

