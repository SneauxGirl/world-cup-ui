"use client";

import Link from "next/link";
import { useRef, type ComponentType, type SVGProps } from "react";
import ShoppingCartIcon, {
  SHOPPING_CART_NAV_STROKE,
} from "@/components/icons/ShoppingCartIcon";
import TrophyIcon, {
  type AnimatedIconHandle,
} from "@/components/icons/TrophyIcon";
import styles from "./Navigation.module.scss";

type AnimatedNavIcon = "trophy" | "cart";

type Props = {
  href: string;
  label: string;
  active?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  animateIcon?: AnimatedNavIcon;
};

export function SidebarNavLink({
  href,
  label,
  active = false,
  icon: Icon,
  animateIcon,
}: Props) {
  const animatedIcon = animateIcon;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const linkClass = active ? styles.sideLinkActive : styles.sideLink;

  const playIcon = () => iconRef.current?.startAnimation();
  const stopIcon = () => iconRef.current?.stopAnimation();

  const animatedHandlers = animatedIcon
    ? {
        onMouseEnter: playIcon,
        onMouseLeave: stopIcon,
        onFocus: playIcon,
        onBlur: stopIcon,
      }
    : {};

  const animatedIconProps = {
    ref: iconRef,
    size: 22,
    strokeWidth: animatedIcon === "cart" ? SHOPPING_CART_NAV_STROKE : 1.75,
    color: "currentColor",
  };

  const isPlaceholder = href === "#";

  return (
    <Link
      href={href}
      className={linkClass}
      aria-current={active ? "page" : undefined}
      aria-disabled={isPlaceholder ? true : undefined}
      onClick={isPlaceholder ? (event) => event.preventDefault() : undefined}
      {...animatedHandlers}
    >
      {animatedIcon === "trophy" ? (
        <TrophyIcon {...animatedIconProps} />
      ) : animatedIcon === "cart" ? (
        <ShoppingCartIcon {...animatedIconProps} />
      ) : Icon ? (
        <Icon />
      ) : null}
      <span className={styles.sideLinkLabel}>{label}</span>
    </Link>
  );
}
