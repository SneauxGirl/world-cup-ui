export const PAGE_TOP_ID = "page-top";

const SCROLL_SETTLE_FALLBACK_MS = 800;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusPageTop(): void {
  document.getElementById(PAGE_TOP_ID)?.focus({ preventScroll: true });
}

/** Scroll to page top, then move focus to the `#page-top` sentinel. */
export function scrollToPageTop(): void {
  const reduced = prefersReducedMotion();

  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  if (reduced) {
    focusPageTop();
    return;
  }

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    window.removeEventListener("scrollend", settle);
    focusPageTop();
  };

  window.addEventListener("scrollend", settle, { once: true });
  window.setTimeout(settle, SCROLL_SETTLE_FALLBACK_MS);
}
