import Image from "next/image";
import { loginStoryPromos } from "@/data/login-story-promos";
import { t } from "@/lib/i18n/t";
import styles from "./LoginStoryPromos.module.scss";

export function LoginStoryPromos() {
  return (
    <section className={styles.section} aria-labelledby="login-story-promos-heading">
      <div className={styles.inner}>
        <h2 id="login-story-promos-heading" className={styles.heading}>
          {t("loginStoryPromos.heading")}
        </h2>
        <ul className={styles.grid}>
          {loginStoryPromos.map((promo) => (
            <li key={promo.id} className={styles.item}>
              <a
                href={promo.href}
                className={styles.card}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.mediaFrame}>
                  <div className={styles.mediaInner}>
                    <Image
                      src={promo.imageSrc}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 72vw, 220px"
                      className={styles.mediaImg}
                      style={
                        promo.imagePosition
                          ? { objectPosition: promo.imagePosition }
                          : undefined
                      }
                    />
                  </div>
                </div>
                <div className={styles.copy}>
                  <p className={styles.title}>{t(`loginStoryPromos.items.${promo.titleKey}.title`)}</p>
                  <p className={styles.eyebrow}>
                    {t(`loginStoryPromos.items.${promo.eyebrowKey}.eyebrow`)}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
