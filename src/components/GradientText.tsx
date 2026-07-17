import { createElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Animate the gradient with a moving luxury sheen. */
  shimmer?: boolean;
}

/** Renders text with the signature rose-gold → lavender gradient. */
export function GradientText({
  children,
  className,
  as: Tag = "span",
  shimmer,
}: GradientTextProps) {
  return createElement(
    Tag,
    { className: cn(shimmer ? "shimmer-text" : "text-gradient", className) },
    children,
  );
}
