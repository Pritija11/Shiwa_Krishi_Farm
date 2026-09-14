"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Optional stagger delay in ms, applied via transition-delay. */
  delayMs?: number;
};

// Subtle, repeatable fade-up reveal: toggles visibility every time the
// element crosses into/out of the viewport (no "once" flag), so scrolling
// back up replays it. Respects prefers-reduced-motion via the .reveal CSS
// rule in globals.css, which disables the transition/transform outright.
export default function Reveal({
  children,
  className = "",
  delayMs,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
