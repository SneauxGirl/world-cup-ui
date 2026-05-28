"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { loginStoryPromos, type LoginStoryPromo } from "@/data/login-story-promos";
import { t } from "@/lib/i18n/t";
import styles from "./LoginStoryPromos.module.scss";

const LOOP_SET_COUNT = 3;
const FOCUS_SET_INDEX = 1;

type LoopItem = {
  promo: LoginStoryPromo;
  setIndex: number;
};

const loopItems: LoopItem[] = Array.from({ length: LOOP_SET_COUNT }, (_, setIndex) =>
  loginStoryPromos.map((promo) => ({ promo, setIndex })),
).flat();

function getPromoIndex(promoId: string) {
  return loginStoryPromos.findIndex((promo) => promo.id === promoId);
}

function StoryPromoCard({
  promo,
  prioritizeImage = false,
  tabIndex,
  cardRef,
  onKeyDown,
  onFocus,
}: {
  promo: LoginStoryPromo;
  prioritizeImage?: boolean;
  tabIndex: number;
  cardRef?: (node: HTMLAnchorElement | null) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onFocus: (event: FocusEvent<HTMLAnchorElement>) => void;
}) {
  const storyTitle = t(`loginStoryPromos.items.${promo.titleKey}.title`);
  const storyEyebrow = t(`loginStoryPromos.items.${promo.eyebrowKey}.eyebrow`);

  return (
    <a
      ref={cardRef}
      href={promo.href}
      className={styles.card}
      tabIndex={tabIndex}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${storyTitle} (${storyEyebrow})`}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    >
      <div className={styles.mediaFrame}>
        <div className={styles.mediaInner}>
          <Image
            src={promo.imageSrc}
            alt=""
            fill
            priority={prioritizeImage}
            loading={prioritizeImage ? "eager" : "lazy"}
            sizes="(max-width: 768px) 72vw, 220px"
            className={styles.mediaImg}
            style={promo.imagePosition ? { objectPosition: promo.imagePosition } : undefined}
          />
        </div>
      </div>
      <div className={styles.copy}>
        <p className={styles.title}>{storyTitle}</p>
        <p className={styles.eyebrow}>{storyEyebrow}</p>
      </div>
    </a>
  );
}

export function LoginStoryPromos() {
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>(
    loginStoryPromos.map(() => null),
  );
  const setWidthRef = useRef(0);
  const dragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  }>({ pointerId: null, startX: 0, startScrollLeft: 0, didDrag: false });
  const [motionPref, setMotionPref] = useState<"unknown" | "reduce" | "ok">("unknown");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const infiniteScroll = motionPref === "ok";

  const measureSetWidth = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= 0) return 0;
    return el.scrollWidth / LOOP_SET_COUNT;
  }, []);

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

  const alignPromoInScroller = useCallback(
    (promoIndex: number, behavior: ScrollBehavior = "auto") => {
      const scroller = scrollerRef.current;
      const card = cardRefs.current[promoIndex];
      const firstCard = cardRefs.current[0];
      if (!scroller || !card || !firstCard) return;

      const setWidth = setWidthRef.current || measureSetWidth();
      if (setWidth > 0) {
        setWidthRef.current = setWidth;
      }

      const paddingLeft = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
      const offsetInSet = card.offsetLeft - firstCard.offsetLeft;
      const targetLeft =
        infiniteScroll && setWidth > 0
          ? setWidth + offsetInSet - paddingLeft
          : card.offsetLeft - paddingLeft;

      scroller.scrollTo({ left: targetLeft, behavior });
      if (infiniteScroll) {
        requestAnimationFrame(() => wrapScrollPosition());
      }
    },
    [infiniteScroll, measureSetWidth, wrapScrollPosition],
  );

  const scrollToMiddleSet = useCallback(() => {
    const setWidth = measureSetWidth();
    if (setWidth > 0) {
      setWidthRef.current = setWidth;
    }
    alignPromoInScroller(0);
  }, [alignPromoInScroller, measureSetWidth]);

  const focusAndScrollToPromo = useCallback(
    (promoIndex: number, behavior: ScrollBehavior = "auto") => {
      const card = cardRefs.current[promoIndex];
      if (!card) return;

      setActiveIndex(promoIndex);
      card.focus({ preventScroll: true });
      alignPromoInScroller(promoIndex, behavior);
    },
    [alignPromoInScroller],
  );

  const handlePromoFocus = useCallback(
    (promoIndex: number, event: FocusEvent<HTMLAnchorElement>) => {
      const scroller = scrollerRef.current;
      const related = event.relatedTarget;
      const fromOutside = !related || !scroller?.contains(related as Node);

      if (fromOutside && promoIndex !== 0) {
        requestAnimationFrame(() => focusAndScrollToPromo(0));
        return;
      }

      if (promoIndex !== activeIndex) {
        setActiveIndex(promoIndex);
      }

      if (fromOutside) {
        alignPromoInScroller(promoIndex);
      }
    },
    [activeIndex, alignPromoInScroller, focusAndScrollToPromo],
  );

  const moveActivePromo = useCallback(
    (nextIndex: number) => {
      const count = loginStoryPromos.length;
      const wrappedIndex = ((nextIndex % count) + count) % count;
      focusAndScrollToPromo(wrappedIndex);
    },
    [focusAndScrollToPromo],
  );

  const handlePromoKeyDown = useCallback(
    (event: KeyboardEvent, promoIndex: number) => {
      let targetIndex: number | null = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          targetIndex = promoIndex + 1;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          targetIndex = promoIndex - 1;
          break;
        case "Home":
          targetIndex = 0;
          break;
        case "End":
          targetIndex = loginStoryPromos.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      moveActivePromo(targetIndex);
    },
    [moveActivePromo],
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionPref(mq.matches ? "reduce" : "ok");
    updateMotion();
    mq.addEventListener("change", updateMotion);
    return () => mq.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0 && !infiniteScroll) return;

      if (infiniteScroll) {
        event.preventDefault();
        el.scrollLeft += delta;
        wrapScrollPosition();
        return;
      }

      const scrollingRight = delta > 0;
      const scrollingLeft = delta < 0;
      const canScroll =
        (scrollingRight && el.scrollLeft < maxScroll - 1) ||
        (scrollingLeft && el.scrollLeft > 0);

      if (canScroll) {
        event.preventDefault();
      }

      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [infiniteScroll, wrapScrollPosition]);

  const handleScrollerPointerDown = useCallback((event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      didDrag: false,
    };
    setIsDragging(true);
    el.setPointerCapture(event.pointerId);
  }, []);

  const handleScrollerPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLUListElement>) => {
      if (dragRef.current.pointerId !== event.pointerId) return;
      const el = scrollerRef.current;
      if (!el) return;

      const dx = event.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 4) {
        dragRef.current.didDrag = true;
      }

      el.scrollLeft = dragRef.current.startScrollLeft - dx;
      if (infiniteScroll) {
        wrapScrollPosition();
      }
    },
    [infiniteScroll, wrapScrollPosition],
  );

  const endScrollerDrag = useCallback((event: ReactPointerEvent<HTMLUListElement>) => {
    const el = scrollerRef.current;
    if (!el || dragRef.current.pointerId !== event.pointerId) return;

    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    dragRef.current.pointerId = null;
    setIsDragging(false);
  }, []);

  const handleScrollerClickCapture = useCallback((event: ReactMouseEvent<HTMLUListElement>) => {
    if (!dragRef.current.didDrag) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.didDrag = false;
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
        <p id="login-story-promos-carousel-hint" className={styles.carouselHint}>
          {t("loginStoryPromos.carouselHint")}
        </p>
        <ul
          ref={scrollerRef}
          className={[
            styles.grid,
            infiniteScroll && styles.gridLoop,
            isDragging && styles.gridDragging,
          ]
            .filter(Boolean)
            .join(" ")}
          role="list"
          aria-label={t("loginStoryPromos.carouselLabel")}
          aria-describedby="login-story-promos-carousel-hint"
          onScroll={infiniteScroll ? wrapScrollPosition : undefined}
          onPointerDown={handleScrollerPointerDown}
          onPointerMove={handleScrollerPointerMove}
          onPointerUp={endScrollerDrag}
          onPointerCancel={endScrollerDrag}
          onClickCapture={handleScrollerClickCapture}
        >
          {items.map(({ promo, setIndex }) => {
            const promoIndex = getPromoIndex(promo.id);
            const isFocusableSet = !infiniteScroll || setIndex === FOCUS_SET_INDEX;
            const isActive = isFocusableSet && promoIndex === activeIndex;

            return (
              <li
                key={`${promo.id}-${setIndex}`}
                className={styles.item}
                aria-hidden={isFocusableSet ? undefined : true}
                {...(!isFocusableSet && infiniteScroll ? { inert: true } : {})}
              >
                <StoryPromoCard
                  promo={promo}
                  prioritizeImage={promoIndex === 0 && setIndex === 0}
                  tabIndex={isActive ? 0 : -1}
                  cardRef={
                    isFocusableSet
                      ? (node) => {
                          cardRefs.current[promoIndex] = node;
                        }
                      : undefined
                  }
                  onKeyDown={(event) => handlePromoKeyDown(event, promoIndex)}
                  onFocus={(event) => handlePromoFocus(promoIndex, event)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
