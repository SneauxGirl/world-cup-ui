/** Animated cart from shadcn registry: https://itshover.com/r/shopping-cart-icon.json */

"use client";

import {
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import type { AnimatedIconHandle, AnimatedIconProps } from "@/components/icons/TrophyIcon";

/** Match 1.75 stroke on 24×24 nav icons when this icon uses a 48×48 viewBox. */
export const SHOPPING_CART_NAV_STROKE = 1.75 * 2;

const ShoppingCartIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 2,
      className = "",
      ...svgProps
    },
    ref,
  ) => {
    const [scope, animate] = useAnimate();
    const reduceMotion = useReducedMotion();

    const start = useCallback(async () => {
      if (reduceMotion) return;
      animate(
        ".cart-upper",
        { x: [0, 10, 0] },
        { duration: 0.6, ease: "easeInOut" },
      );
      animate(
        ".cart-wheel-left",
        { rotate: [0, 180, 0], x: [0, 10, 0] },
        { duration: 0.6, ease: "easeInOut" },
      );
      animate(
        ".cart-wheel-right",
        { rotate: [0, 180, 0], x: [0, 10, 0] },
        { duration: 0.6, ease: "easeInOut" },
      );
      animate(
        ".cart-item",
        { y: [0, -2, 0] },
        { duration: 0.4, ease: "easeInOut" },
      );
    }, [animate, reduceMotion]);

    const stop = useCallback(() => {
      if (reduceMotion) return;
      animate(
        ".cart-upper, .cart-wheel-left, .cart-wheel-right, .cart-item",
        { x: 0, rotate: 0, y: 0 },
        { duration: 0.2, ease: "easeInOut" },
      );
    }, [animate, reduceMotion]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onPointerEnter={start}
        onPointerLeave={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ overflow: "visible" }}
        {...svgProps}
        aria-hidden
      >
        <motion.path
          className="cart-upper"
          d="M8.49994 10H41L37.569 21.4367C36.9345 23.5517 34.9879 25 32.7798 25H10.4999"
        />
        <motion.path
          className="cart-wheel-left"
          style={{ transformOrigin: "11px 41px" }}
          d="M11 45C13.2091 45 15 43.2091 15 41C15 38.7909 13.2091 37 11 37C8.79086 37 7 38.7909 7 41C7 43.2091 8.79086 45 11 45Z"
        />
        <motion.path
          className="cart-wheel-right"
          style={{ transformOrigin: "37px 41px" }}
          d="M37 45C39.2091 45 41 43.2091 41 41C41 38.7909 39.2091 37 37 37C34.7909 37 33 38.7909 33 41C33 43.2091 34.7909 45 37 45Z"
        />
        <motion.path
          className="cart-upper"
          d="M41 32H9.46174C7.17727 32 6.08953 29.1885 7.77914 27.651L10.6923 25L7.81067 5.14103C7.63231 3.91188 6.57863 3.00005 5.33661 3.00003L3 3"
        />
        <motion.path className="cart-item cart-upper" d="M30 16L30 19" />
        <motion.path className="cart-item cart-upper" d="M24 16L24 19" />
        <motion.path className="cart-item cart-upper" d="M18 16L18 19" />
      </motion.svg>
    );
  },
);

ShoppingCartIcon.displayName = "ShoppingCartIcon";

export default ShoppingCartIcon;
