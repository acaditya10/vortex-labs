"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observes an element and flips `inView` once it enters the viewport.
 * When IntersectionObserver is unavailable or the user prefers reduced
 * motion, the content is revealed right after mount so it is never left
 * invisible. State updates are scheduled asynchronously so they land
 * after hydration commit.
 */
export function useInView<T extends HTMLElement>(opts?: {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}) {
  const once = opts?.once ?? true;
  const rootMargin = opts?.rootMargin ?? "0px 0px -12% 0px";
  const threshold = opts?.threshold ?? 0.01;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setInView(true));
      return;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setInView(true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
