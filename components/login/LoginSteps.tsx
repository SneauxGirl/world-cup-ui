import Image from "next/image";
import { loginSteps } from "@/data/login-steps";
import { t } from "@/lib/i18n/t";
import styles from "./LoginSteps.module.scss";

type Props = {
  onSignIn?: () => void;
};

export function LoginSteps({ onSignIn }: Props = {}) {
  return (
    <section className={styles.section} aria-label={t("loginSteps.regionLabel")}>
      <div className={styles.inner}>
        <ol className={styles.list}>
          {loginSteps.map((step, index) => {
            const title = t(`loginSteps.steps.${step.copyKey}.title`);

            return (
              <li key={step.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.card}
                  aria-label={`${title}. ${t("login.signIn")}`}
                  onClick={onSignIn}
                >
                  <div className={styles.cardFrame}>
                    <div className={styles.cardInner}>
                      <div className={styles.media}>
                        <Image
                          src={step.imageSrc}
                          alt=""
                          fill
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.mediaImg}
                        />
                      </div>
                      <div className={styles.copy}>
                        <h3 id={`login-step-${step.id}-title`} className={styles.title}>
                          {title}
                        </h3>
                        <p className={styles.body}>
                          {t(`loginSteps.steps.${step.copyKey}.body`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
