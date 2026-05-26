"use client";

import Image from "next/image";
import { t } from "@/lib/i18n/t";
import formStyles from "./LoginForm.module.scss";
import styles from "./LoginHeroPrompt.module.scss";

type Props = {
  onSignIn: () => void;
};

export function LoginHeroPrompt({ onSignIn }: Props) {
  return (
    <div className={styles.promptFrame}>
      <div className={[formStyles.loginCard, styles.promptCard].join(" ")}>
        <div className={styles.brandLogo}>
          <Image
            src="/wcc-words-logo.png"
            alt={t("app.worldCupChallenge")}
            width={512}
            height={256}
            className={styles.brandLogoImg}
            priority
            unoptimized
          />
        </div>
        <h1 className={[formStyles.title, styles.promptTitle].join(" ")}>
          {t("login.titleLine1")}
          <br />
          {t("login.titleLine2")}
        </h1>

        <div className={styles.actions}>
          <div className={formStyles.chamferTrim}>
            <button
              type="button"
              className={[formStyles.chamferBtn, formStyles.signInBtn].join(" ")}
              onClick={onSignIn}
            >
              {t("login.signIn")}
            </button>
          </div>
          <div className={[formStyles.chamferTrim, styles.signUpTrim].join(" ")}>
            <button
              type="button"
              className={[formStyles.chamferBtn, styles.signUpBtn].join(" ")}
              aria-disabled="true"
              onClick={(event) => event.preventDefault()}
            >
              {t("login.signUp")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
