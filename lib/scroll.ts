/**
 * Document position of an element from layout alone (offsetTop chain).
 * getBoundingClientRect includes CSS transforms, so while a page is turning
 * or receding it reports a skewed position; layout offsets do not.
 */
export function layoutTop(element: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = element;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/** Scroll so the element sits just below the fixed header. */
export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior) {
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  window.scrollTo({ top: Math.max(0, layoutTop(element) - padding), behavior });
}
