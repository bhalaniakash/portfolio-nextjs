"use client";

import { useEffect } from "react";

/**
 * Keeps the `js` class on <html>. The inline script in the layout adds it
 * before first paint; if React later re-renders <html> (Fast Refresh, an
 * error recovery), the class would be dropped and the hero pin and gallery
 * layout would fall back mid-session. This puts it back.
 */
export function JsFlag() {
  useEffect(() => {
    const html = document.documentElement;
    const ensure = () => {
      if (!html.classList.contains("js")) html.classList.add("js");
    };
    ensure();
    const observer = new MutationObserver(ensure);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
