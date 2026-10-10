/**
 * Runs `callback` when the main thread is idle (or after `timeout` ms at the
 * latest). Scroll scenes are set up this way so their measurement work does
 * not lengthen hydration. Returns a cancel function.
 */
export function whenIdle(callback: () => void, timeout = 1000) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 60);
  return () => window.clearTimeout(id);
}
