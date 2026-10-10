"use client";

import { useEffect, useRef } from "react";
import { whenIdle } from "@/lib/idle";

const ACCENT = [165, 148, 255] as const;
const BASE = [236, 235, 243] as const;

// Colours are precomputed in a few steps from base to accent; per-dot
// opacity goes through globalAlpha, so the loop never builds strings.
const MIX_STEPS = 8;
const PALETTE = Array.from({ length: MIX_STEPS + 1 }, (_, step) => {
  const mix = step / MIX_STEPS;
  const channel = (i: 0 | 1 | 2) => Math.round(BASE[i] + (ACCENT[i] - BASE[i]) * mix);
  return `rgb(${channel(0)},${channel(1)},${channel(2)})`;
});

/**
 * A grid of points that ripples slowly and bends away from the pointer.
 * Decorative only: hidden from assistive technology, pointer-transparent,
 * paused off-screen, and rendered as a single still frame for reduced motion.
 */
export function SignalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let points: Float32Array = new Float32Array(0);
    let frame = 0;
    let running = false;
    let visible = true;
    // The still frame is drawn at once; the loop starts when the page is idle.
    let armed = false;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Touch devices get a sparser grid and half the frame rate.
      const gap = finePointer ? 30 : 34;
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const offsetX = (width - (cols - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;
      points = new Float32Array(cols * rows * 2);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          points[i++] = offsetX + c * gap;
          points[i++] = offsetY + r * gap;
        }
      }
    };

    const draw = (time: number) => {
      const t = time * 0.00045;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const radius = 170;
      const cx = width * 0.5;
      const cy = height * 0.45;
      const maxDist = Math.hypot(cx, cy);

      for (let i = 0; i < points.length; i += 2) {
        let x = points[i];
        let y = points[i + 1];

        // Slow travelling wave, strongest near the centre of the hero.
        const wave = Math.sin(t * 2 + x * 0.011 + y * 0.006) * Math.cos(t * 1.3 - y * 0.009);
        const centreFalloff = 1 - Math.min(Math.hypot(x - cx, y - cy) / maxDist, 1);
        let intensity = 0.13 + Math.max(wave, 0) * 0.5 * centreFalloff;
        let size = 1.2 + Math.max(wave, 0) * 1.2 * centreFalloff;
        let mix = 0;

        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const force = 1 - dist / radius;
          const eased = force * force;
          x += (dx / (dist || 1)) * eased * 22;
          y += (dy / (dist || 1)) * eased * 22;
          intensity = Math.min(intensity + eased * 0.85, 1);
          size += eased * 1.6;
          mix = eased;
        }

        ctx.fillStyle = PALETTE[Math.round(mix * MIX_STEPS)];
        ctx.globalAlpha = intensity;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    let skip = false;
    const loop = (time: number) => {
      skip = !finePointer && !skip;
      if (!skip) draw(time);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!armed || running || reduceMotion || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    build();
    draw(0);

    const resizeObserver = new ResizeObserver(() => {
      build();
      if (!running) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    const cancelIdle = whenIdle(() => {
      armed = true;
      start();
    }, 1500);

    return () => {
      cancelIdle();
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
