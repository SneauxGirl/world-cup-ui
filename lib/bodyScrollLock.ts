const LOCK_CLASS = "wcui-scroll-lock";

let lockCount = 0;

/** Measure classic scrollbar width before overflow is hidden. */
function measureScrollbarWidth(): number {
  const fromViewport = window.innerWidth - document.documentElement.clientWidth;
  if (fromViewport > 0) return fromViewport;

  const root = document.documentElement;
  if (root.scrollHeight <= root.clientHeight) return 0;

  const outer = document.createElement("div");
  outer.style.cssText =
    "visibility:hidden;overflow:scroll;width:100px;height:100px;position:absolute;top:-9999px;left:-9999px";
  document.body.appendChild(outer);
  const inner = document.createElement("div");
  inner.style.height = "200px";
  outer.appendChild(inner);
  const width = outer.offsetWidth - inner.offsetWidth;
  outer.remove();
  return width;
}

export function lockBodyScroll(): void {
  if (lockCount === 0) {
    const width = measureScrollbarWidth();
    const root = document.documentElement;
    root.classList.add(LOCK_CLASS);
    if (width > 0) {
      root.style.setProperty("--wcui-scrollbar-compensate", `${width}px`);
    }
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const root = document.documentElement;
    root.classList.remove(LOCK_CLASS);
    root.style.removeProperty("--wcui-scrollbar-compensate");
  }
}
