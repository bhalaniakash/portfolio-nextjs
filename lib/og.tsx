import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared typographic social card used by the home page and case studies. */
export function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(90% 120% at 15% 0%, #2a2350 0%, #0a0a0f 60%)",
          color: "#ecebf3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, color: "#a3a2b8", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#a594ff" }} />
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 18 ? 96 : 132, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a3a2b8" }}>
          <span>{footer}</span>
          <span style={{ color: "#a594ff" }}>Akash Bhalani</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
