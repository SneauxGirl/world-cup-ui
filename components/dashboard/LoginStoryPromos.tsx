"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { loginStoryPromos, type LoginStoryPromo } from "@/data/login-story-promos";
import { t } from "@/lib/i18n/t";
import styles from "./LoginStoryPromos.module.scss";

const LOOP_SET_COUNT = 3;

type LoopItem = {
  promo: LoginStoryPromo;
  setIndex: number;
};

const loopItems: LoopItem[] = Array.from({ length: LOOP_SET_COUNT }, (_, setIndex) =>
  loginStoryPromos.map((promo) => ({ promo, setIndex })),
).flat();

function StoryPromoCard({ promo }: { promo: LoginStoryPromo }) {
  return (
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
            style={promo.imagePosition ? { objectPosition: promo.imagePosition } : undefined}
          />
        </div>
      </div>
      <div className={styles.copy}>
        <p className={styles.title}>{t(`loginStoryPromos.items.${promo.titleKey}.title`)}</p>
        <p className={styles.eyebrow}>{t(`loginStoryPromos.items.${promo.eyebrowKey}.eyebrow`)}</p>
      </div>
    </a>
  );
}

export function LoginStoryPromos() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const setWidthRef = useRef(0);
  const [motionPref, setMotionPref] = useState<"unknown" | "reduce" | "ok">("unknown");
  const infiniteScroll = motionPref === "ok";

  const measureSetWidth = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= 0) return 0;
    return el.scrollWidth / LOOP_SET_COUNT;
  }, []);

  const scrollToMiddleSet = useCallback(() => {
    const el = scrollerRef.current;
    const setWidth = measureSetWidth();
    if (!el || setWidth <= 0) return;
    setWidthRef.current = setWidth;
    el.scrollLeft = setWidth;
  }, [measureSetWidth]);

  const wrapScrollPosition = useCallback(() => {
    const el = scrollerRef.current;
    const setWidth = setWidthRef.current;
    if (!el || setWidth <= 0) return;

    if (el.scrollLeft < setWidth * 0.5) {
      el.scrollLeft += setWidth;
    } else if (el.scrollLeft > setWidth * 1.5) {
      el.scrollLeft -= setWidth;
    }
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionPref(mq.matches ? "reduce" : "ok");
    updateMotion();
    mq.addEventListener("change", updateMotion);
    return () => mq.removeEventListener("change", updateMotion);
  }, []);

  useLayoutEffect(() => {
    if (!infiniteScroll) return;

    scrollToMiddleSet();

    const el = scrollerRef.current;
    if (!el) return;

    const onResize = () => scrollToMiddleSet();
    const observer = new ResizeObserver(onResize);
    observer.observe(el);

    return () => observer.disconnect();
  }, [infiniteScroll, scrollToMiddleSet]);

  const items = infiniteScroll
    ? loopItems
    : loginStoryPromos.map((promo) => ({ promo, setIndex: 0 }));

  return (
    <section className={styles.section} aria-labelledby="login-story-promos-heading">
      <div className={styles.inner}>
        <h2 id="login-story-promos-heading" className={styles.heading}>
          {t("loginStoryPromos.heading")}
        </h2>
        <ul
          ref={scrollerRef}
          className={[styles.grid, infiniteScroll && styles.gridLoop].filter(Boolean).join(" ")}
          onScroll={infiniteScroll ? wrapScrollPosition : undefined}
        >
          {items.map(({ promo, setIndex }) => (
            <li key={`${promo.id}-${setIndex}`} className={styles.item}>
              <StoryPromoCard promo={promo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
