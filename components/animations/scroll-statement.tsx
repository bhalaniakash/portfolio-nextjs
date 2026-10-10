"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type Segment = { text: string; accent?: boolean };

/**
 * A paragraph whose words brighten in sequence as it scrolls through the
 * viewport. The full text is server-rendered; only opacity is animated.
 */
export function ScrollStatement({ segments }: { segments: Segment[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const words = segments.flatMap((segment) =>
    segment.text.split(" ").filter(Boolean).map((word) => ({ word, accent: segment.accent })),
  );

  return (
    <p ref={ref} className="text-[clamp(1.75rem,4.6vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.03em]">
      {words.map(({ word, accent }, index) => (
        <Word
          key={`${word}-${index}`}
          progress={scrollYProgress}
          range={[index / words.length, Math.min((index + 3) / words.length, 1)]}
          accent={accent}
          still={Boolean(reduceMotion)}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
  still: boolean;
}) {
  // Resting opacity stays above WCAG 3:1 for large text, so unread words remain legible.
  const opacity = useTransform(progress, range, [accent ? 0.6 : 0.4, 1]);
  return (
    <>
      <motion.span style={{ opacity: still ? 1 : opacity }} className={accent ? "serif-accent text-accent" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}
