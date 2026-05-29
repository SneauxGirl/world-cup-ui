import Image from "next/image";
import { loginSteps } from "@/data/login-steps";
import { t } from "@/lib/i18n/t";
import styles from "./LoginSteps.module.scss";

export function LoginSteps() {
  return (
    <section className={styles.section} aria-label={t("loginSteps.regionLabel")}>
      <div className={styles.inner}>
        <ol className={styles.list}>
          {loginSteps.map((step, index) => (
            <li key={step.id} className={styles.item}>
              <article
                className={styles.card}
                aria-labelledby={`login-step-${step.id}-title`}
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
                        {t(`loginSteps.steps.${step.copyKey}.title`)}
                      </h3>
                      <p className={styles.body}>
                        {t(`loginSteps.steps.${step.copyKey}.body`)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
