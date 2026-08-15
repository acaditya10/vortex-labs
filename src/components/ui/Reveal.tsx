"use client";

import { useInView } from "@/components/ui/useInView";
import styles from "./Reveal.module.css";

type RevealProps = {
  children: React.ReactNode;
  variant?: "up" | "fade" | "clip";
  delay?: number;
  className?: string;
};

export function Reveal({ children, variant = "up", delay = 0, className = "" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -8% 0px" });

  const variantClass =
    variant === "fade" ? styles.fade : variant === "clip" ? styles.clip : styles.up;

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${variantClass} ${inView ? styles.in : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
